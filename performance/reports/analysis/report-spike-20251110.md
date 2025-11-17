# 📋 Relatório de Teste de Performance – API ShortBeyond

**Autor:** Danilo Melin
**Data:** 10 de Novembro de 2025
**Ferramenta:** Artillery
**Ambiente:** Localhost
**Tipo de Teste:** Pico (Spike Test)

-----

## Objetivo

Avaliar o comportamento, estabilidade e capacidade de recuperação da API (`/api/auth/login` e `/api/links`) sob um pico repentino de carga (simulando 100 req/s).

-----

## Configuração do Teste

| Parâmetro            | Valor                          |
| :------------------- | :----------------------------- |
| Endpoint             | Fluxo Completo (Login + Links) |
| Duração              | (Não especificado)             |
| Carga                | Pico (simulando 100 req/s)     |
| Total de Requisições | 7.063                          |
| Ferramenta           | Artillery                      |
| Ambiente             | Localhost                      |

-----

## Critérios de Aceitação

| Critério           | Meta       | Resultado     | Status |
| :----------------- | :--------- | :------------ | :----- |
| Sucesso (Pico)     | ≥ 90%      | **71,6%**     | 🔴      |
| P95 (Pico)         | \< 2000 ms | **8024.5 ms** | 🔴      |
| Erros 5xx (Pico)   | ≤ 3%       | **7,55%**     | 🔴      |
| Crashes (Timeouts) | 0          | **106**       | 🔴      |

-----

## Resultados

| Métrica | Valor          |
| :------ | :------------- |
| Min     | **1 ms**       |
| Max     | **9.966 ms**   |
| Média   | **3.410,7 ms** |
| P95     | **8.024,5 ms** |
| P99     | **9.416,8 ms** |

-----

### Gráfico de Tempo de Resposta (ms)

Max | ████████████ 9966

P99 | ███████████ 9416

P95 | █████████ 8024

Mean| ████ 3410

Min | 0

> 💬 Visualização simplificada do comportamento do sistema.
> Mantém clareza e compatibilidade com Markdown.

-----

## Análise Técnica

- O sistema **falhou catastroficamente** ao receber o pico de carga, reprovando em todos os critérios de aceitação.
- A latência P95 aumentou para **8 segundos**, 4 vezes acima do SLA de 2 segundos.
- A taxa de sucesso (71,6%) ficou muito abaixo dos 90% esperados.
- Ocorreram **533 erros 5xx** (Internal Server Error), resultando em uma taxa de erro de **7,55%** (mais que o dobro do limite de 3%).
- O sistema apresentou **106 erros ETIMEDOUT**, indicando indisponibilidade total e incapacidade de processar as requisições.

-----

## Conclusão

**Resultado:** Reprovado (Falha Crítica) 🔴

A aplicação não suportou o pico de carga e entrou em colapso. O sistema não demonstrou capacidade de recuperação e falhou em manter a disponibilidade.

-----

## Recomendações

1. **Crítico:** Investigar a causa raiz dos erros `5xx` e `Timeouts`. (Provável gargalo no banco de dados, pool de conexões esgotado ou falta de recursos de CPU/Memória).
2. Implementar *Rate Limiting* (limitação de taxa) na API para proteger o sistema contra picos abruptos e garantir a disponibilidade (retornando `429 Too Many Requests` em vez de `5xx` ou `Timeout`).
3. Revisar a otimização das queries de `login` e `links` que foram executadas durante o fluxo.
