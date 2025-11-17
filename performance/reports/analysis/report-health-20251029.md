# 📋 Relatório de Teste de Performance – API ShortBeyond

**Autor:** Danilo Melin
**Data:** 29 de Outubro de 2025
**Ferramenta:** Artillery
**Ambiente:** Localhost
**Tipo de Teste:** Carga (Smoke Test)

-----

## Objetivo

Validar o tempo de resposta e estabilidade do endpoint `/health` sob carga de 5 usuários virtuais por segundo.

-----

## Configuração do Teste

| Parâmetro            | Valor     |
| :------------------- | :-------- |
| Endpoint             | `/health` |
| Duração              | 30s       |
| Carga                | 5 req/s   |
| Total de Requisições | 150       |
| Ferramenta           | Artillery |
| Ambiente             | Localhost |

-----

## Critérios de Aceitação

| Critério   | Meta  | Resultado | Status |
| :--------- | :---- | :-------- | :----- |
| Status 200 | 100%  | **100%**  | 🟢      |
| P95 (ms)   | \< 50 | **1**     | 🟢      |
| Erros (%)  | 0%    | **0%**    | 🟢      |

-----

## Resultados

| Métrica | Valor      |
| :------ | :--------- |
| Min     | **0 ms**   |
| Max     | **10 ms**  |
| Média   | **0.7 ms** |
| P95     | **1 ms**   |
| P99     | **2 ms**   |

-----

### Gráfico de Tempo de Resposta (ms)

Max |■■■■■■■■■■■■ 10

P99 |■■ 2

P95 |■ 1

Mean |■ 0.7

Min | 0

> 💬 Visualização simplificada do comportamento do sistema.
> Mantém clareza e compatibilidade com Markdown.

-----

## Análise Técnica

- A API respondeu consistentemente com latência **extremamente baixa** (média de 0.7ms).
- Nenhum erro foi observado.
- O throughput manteve-se constante em 5 req/s durante todo o período de teste, conforme configurado.

-----

## Conclusão

**Resultado:** Aprovado ✅

O sistema está em conformidade com os critérios de SLA definidos e demonstrou excelente performance.

-----

## Recomendações

1. Executar teste com carga progressiva (20 e 50 req/s) para encontrar o ponto de saturação.
2. Automatizar execução no pipeline CI/CD para monitorar regressões.
3. Integrar métricas ao Grafana/Prometheus para observabilidade contínua.
