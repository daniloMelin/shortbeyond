const { cleanupTestData } = require('./playwright/support/database/cleanup');

module.exports = async () => {
  console.log('🧹 Iniciando limpeza de dados de teste antes da execução...');

  try {
    await cleanupTestData();
    console.log('✅ Limpeza de dados de teste concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a limpeza de dados de teste:', error);
  } finally {
    console.log('🚀 Processo de preparação finalizado.');
  }
};
