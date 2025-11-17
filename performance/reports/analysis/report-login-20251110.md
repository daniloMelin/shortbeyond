# 📋 Relatório de Teste de Performance – API ShortBeyond

**Autor:** Danilo Melin
**Data:** 10 de Novembro de 2025
**Ferramenta:** Artillery
**Ambiente:** Localhost
**Tipo de Teste:** Carga (Load Test)

-----

## Objetivo

Validar o tempo de resposta, estabilidade e a correta distribuição de fluxos de sucesso e erro para o endpoint de **autenticação de usuários** (`/api/auth/login`) sob uma carga normal de operação.

-----

## Configuração do Teste

| Parâmetro            | Valor             |
| :------------------- | :---------------- |
| Endpoint             | `/api/auth/login` |
| Duração              | 60s               |
| Carga                | 4 req/s           |
| Total de Requisições | 240               |
| Ferramenta           | Artillery         |
| Ambiente             | Localhost         |

-----

## Critérios de Aceitação

| Critério        | Meta      | Resultado        | Status |
| :-------------- | :-------- | :--------------- | :----- |
| Logins (200)    | 70% (168) | **70,42%** (169) | 🟢      |
| Erro Auth (401) | 30% (72)  | **29,58%** (71)  | 🟢      |
| P95 (ms)        | \< 500    | **64.7**         | 🟢      |
| `vusers.failed` | 0%        | **0%**           | 🟢      |

-----

## Resultados

| Métrica | Valor       |
| :------ | :---------- |
| Min     | **0 ms**    |
| Max     | **69 ms**   |
| Média   | **61.3 ms** |
| P95     | **64.7 ms** |
| P99     | **66 ms**   |

-----

### Gráfico de Tempo de Resposta (ms)

Max | ████████████ 69

P99 | ████████████ 66

P95 | ███████████ 64.7

Mean| ███████████ 61.3

Min | 0

> 💬 Visualização simplificada do comportamento do sistema.
> Mantém clara e compatibilidade com Markdown.

-----

## Análise Técnica

- O sistema demonstrou **performance excelente e estável**, com o p95 (64.7ms) muito abaixo do SLA de 500ms.
- A distribuição de resultados **atendeu perfeitamente** aos critérios de 70%/30%, validando o comportamento esperado.
- **Nenhuma falha de validação** (`vusers.failed: 0`) ou erro inesperado (`4xx`/`5xx`) foi registrado após a correção da massa de dados.

-----

## Conclusão

**Resultado:** Aprovado ✅

O endpoint de autenticação está em total conformidade com os SLAs de performance e estabilidade definidos no plano de testes.

-----

## Recomendações

1. Executar um teste de stress com carga maior (ex: 25 req/s) para identificar o ponto de saturação deste endpoint.
2. Automatizar a execução deste cenário no pipeline de CI/CD para garantir a detecção de regressões de performance.
