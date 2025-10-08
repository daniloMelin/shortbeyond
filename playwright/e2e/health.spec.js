// @ts-check
import { test, expect } from '@playwright/test';

test('deve verificar se a API está online', async ({ request }) => {
  const response = await request.get('http://localhost:3000/health');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.service).toBe('shortbeyond-api');
  expect(body.status).toBe('healthy');
});
