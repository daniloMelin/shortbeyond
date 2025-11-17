# 📋 Relatório de Teste de Performance – API ShortBeyond

**Autor:** Danilo Melin
**Data:** 10 de Novembro de 2025
**Ferramenta:** Artillery
**Ambiente:** Localhost
**Tipo de Teste:** Carga (Load Test)

-----

## Objetivo

Validar o tempo de resposta, estabilidade e a correta distribuição de fluxos de sucesso e erro para o endpoint de **cadastro de usuários** (`/api/auth/register`) sob uma carga normal de operação.

-----

## Configuração do Teste

| Parâmetro            | Valor                |
| :------------------- | :------------------- |
| Endpoint             | `/api/auth/register` |
| Duração              | 45s                  |
| Carga                | 3 req/s              |
| Total de Requisições | 135                  |
| Ferramenta           | Artillery            |
| Ambiente             | Localhost            |

-----

## Critérios de Aceitação

| Critério               | Meta      | Resultado       | Status |
| :--------------------- | :-------- | :-------------- | :----- |
| Cadastros (201)        | 80% (108) | **76,3%** (103) | ⚠️      |
| E-mail Duplicado (400) | 20% (27)  | **23,7%** (32)  | ⚠️      |
| P95 (ms)               | \< 500    | **67.4**        | 🟢      |
| `vusers.failed`        | 0%        | **0%**          | 🟢      |

-----

## Resultados

| Métrica | Valor       |
| :------ | :---------- |
| Min     | **0 ms**    |
| Max     | **72 ms**   |
| Média   | **50.5 ms** |
| P95     | **67.4 ms** |
| P99     | **71.5 ms** |

-----

### Gráfico de Tempo de Resposta (ms)

Max | ████████████ 72

P99 | ████████████ 71.5

P95 | ███████████ 67.4

Mean| ████████ 50.5

Min | 0

> 💬 Visualização simplificada do comportamento do sistema.
> Mantém clareza e compatibilidade com Markdown.

-----

## Análise Técnica

- A API demonstrou **excelente performance**, com o p95 (67.4ms) ficando muito abaixo do SLA de 500ms.
- **Nenhuma falha de validação** (`vusers.failed: 0`) foi registrada, indicando que a API retornou as propriedades esperadas (`user` para sucesso, `message` para erro) em 100% dos casos.
- A distribuição de resultados ficou próxima, mas **não atendeu exatamente** aos critérios de 80%/20%, o que é uma variação estatística normal da ferramenta Artillery para este volume de requisições.

-----

## Conclusão

**Resultado:** Aprovado ✅

O sistema está em conformidade com os critérios de performance e estabilidade. A variação na distribuição de cenários não indica uma falha da aplicação.

-----

## Recomendações

1. Manter este teste como baseline de performance para o endpoint de cadastro.
2. Aumentar a duração do teste (ex: 5 minutos) para verificar se a variação estatística na distribuição de cenários diminui.
