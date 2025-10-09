import { expect, test } from '@playwright/test';
import { getUser } from '../../support/factories/user';

test.describe('POST /auth/register', () => {
    test('Deve registrar um novo usuário com sucesso', async ({ request }) => {

        const user = getUser();

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        });

        expect(response.status()).toBe(201);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'Usuário cadastrado com sucesso!');

        expect(body.user).toHaveProperty('id');
        expect(body.user).toHaveProperty('name', user.name);
        expect(body.user).toHaveProperty('email', user.email);
        expect(body.user).not.toHaveProperty('password');
    });

    test('Não deve registrar um novo usuário com email já existente', async ({ request }) => {

        const user = getUser();

        const preCondition = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        });

        expect(preCondition.status()).toBe(201);

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'Este e-mail já está em uso. Por favor, tente outro.');
    });

    test('Não deve cadastrar com email inválido', async ({ request }) => {

        const user = {
            name: 'Danilo Costa',
            email: 'costa&gmail.com',
            password: 'Senha123',
        };

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Email\' deve ser um email válido');
    });

    test('Não deve cadastrar sem nome', async ({ request }) => {

        const user = {
            email: 'costa&gmail.com',
            password: 'Senha123',
        };

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Name\' é obrigatório');
    });

    test('Não deve cadastrar sem email', async ({ request }) => {

        const user = {
            name: 'Danilo Costa',
            password: 'Senha123',
        };

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Email\' é obrigatório');
    });

    test('Não deve cadastrar sem senha', async ({ request }) => {

        const user = {
            name: 'Danilo Costa',
            email: 'costa@gmail.com',
        };

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Password\' é obrigatório');
    });
});
