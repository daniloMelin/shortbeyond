const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const { ulid } = require('ulid');
const fs = require('fs');
const path = require('path');

// procurar .env a partir do cwd e subindo até a raiz
function findDotenv(start = process.cwd()) {
  let dir = start;
  while (true) {
    const candidate = path.join(dir, '.env');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

const dotenvPath = findDotenv();
if (dotenvPath) {
  require('dotenv').config({ path: dotenvPath });
  console.log(`✅ Carregado .env de: ${dotenvPath}`);
} else {
  console.warn('⚠️ .env não encontrado (procurei em diretórios ascendentes). Verifique .env na raiz do projeto ou exporte variáveis de ambiente.');
}

// validar variáveis necessárias
const requiredEnv = ['DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_HOST', 'DB_PORT'];
const missing = requiredEnv.filter((k) => {
  const v = process.env[k];
  return v === undefined || v === null || String(v).trim() === '';
});
if (missing.length) {
  console.error(`❌ Variáveis de ambiente faltando: ${missing.join(', ')}`);
  console.error('→ Coloque um .env com essas chaves na raiz do projeto ou exporte as variáveis antes de executar o script.');
  process.exit(1);
}

// criar pool com tipos corretos
const pool = new Pool({
  user: String(process.env.DB_USER),
  host: String(process.env.DB_HOST),
  database: String(process.env.DB_NAME),
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT),
});

async function seedUsers() {
  const client = await pool.connect();
  const BATCH_SIZE = 100;
  const TOTAL_USERS = 4000;
  const PASSWORD = 'Senha123';
  const SALT_ROUNDS = 10;

  try {
    console.log('🔐 Criptografando senha...');
    const hashedPassword = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

    console.log('📝 Gerando dados dos usuários...');
    const users = [];
    const csvData = ['Nome,Email,Senha']; // Cabeçalho do CSV

    for (let i = 0; i < TOTAL_USERS; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const name = `${firstName} ${lastName}`;

      // gerar email a partir do nome (sanitizado)
      const localPart = `${firstName}.${lastName}`.replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase();
      const email = `${localPart}${i}@dmelin.dev`;
      const id = ulid();

      users.push({
        id,
        name,
        email,
        password: hashedPassword,
      });

      // Adicionar ao CSV (sem criptografia). Nome entre aspas para preservar vírgulas
      csvData.push(`"${name}",${email},${PASSWORD}`);
    }

    console.log('💾 Inserindo usuários no banco de dados...');
    await client.query('BEGIN');

    // Inserir em lotes para melhor performance
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      
      const values = [];
      const placeholders = [];
      
      batch.forEach((user, index) => {
        const baseIndex = index * 4;
        placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`);
        values.push(user.id, user.name, user.email, user.password);
      });

      const query = `
        INSERT INTO users (id, name, email, password)
        VALUES ${placeholders.join(', ')}
        ON CONFLICT (email) DO NOTHING;
      `;

      await client.query(query, values);
      console.log(`✅ Inseridos ${Math.min(i + BATCH_SIZE, users.length)}/${TOTAL_USERS} usuários`);
    }

    await client.query('COMMIT');

    // Gerar arquivo CSV em performance/data na raiz do repositório
    console.log('📄 Gerando arquivo CSV...');
    const csvContent = csvData.join('\n');

    const repoRoot = dotenvPath ? path.dirname(dotenvPath) : process.cwd();
    const dataDir = path.join(repoRoot, 'performance', 'data'); // <--- local desejado

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`📁 Diretório criado: ${dataDir}`);
    }

    const csvPath = path.join(dataDir, 'usuarios.csv');
    fs.writeFileSync(csvPath, csvContent, 'utf8');

    console.log(`✅ ${TOTAL_USERS} usuários inseridos com sucesso!`);
    console.log(`📁 Arquivo CSV gerado em: ${csvPath}`);

  } catch (err) {
    await client.query('ROLLBACK').catch(()=>{});
    console.error('❌ Erro ao inserir usuários:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function cleanupTestData() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = `
      WITH usuarios_para_deletar AS (
        SELECT id FROM users WHERE email LIKE '%@dmelin.dev'
      ),
      delete_links AS (
        DELETE FROM links
        WHERE user_id IN (SELECT id FROM usuarios_para_deletar)
      )
      DELETE FROM users
      WHERE id IN (SELECT id FROM usuarios_para_deletar);
    `;

    await client.query(query);

    await client.query('COMMIT');
    console.log('✅ Dados de teste removidos com sucesso.');
  } catch (err) {
    await client.query('ROLLBACK').catch(()=>{});
    console.error('❌ Erro ao limpar dados de teste:', err);
  } finally {
    client.release();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('🎉 Processo concluído!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('💥 Erro fatal:', err);
      process.exit(1);
    });
}

module.exports = { seedUsers, cleanupTestData };