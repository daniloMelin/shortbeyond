import { expect, test } from '@playwright/test';

import { getUser } from '../../support/factories/user';

import { registerService } from '../../support/services/register';

test.describe('POST /auth/register', () => {

    let register;

    test.beforeEach(({ request }) => {
        register = registerService(request);
    });

    test('Deve registrar um novo usuário com sucesso', async () => {
        const user = getUser();

        const response = await register.createUser(user);
        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'Usuário cadastrado com sucesso!');

        expect(body.user).toHaveProperty('id');
        expect(body.user).toHaveProperty('name', user.name);
        expect(body.user).toHaveProperty('email', user.email);
        expect(body.user).not.toHaveProperty('password');
    });

    test('Não deve registrar um novo usuário com email já existente', async () => {
        const user = getUser();

        const preCondition = await register.createUser(user);
        expect(preCondition.status()).toBe(201);

        const response = await register.createUser(user);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'Este e-mail já está em uso. Por favor, tente outro.');
    });

    test('Não deve cadastrar com email inválido', async () => {
        const user = {
            name: 'Danilo Costa',
            email: 'costa&gmail.com',
            password: 'Senha123',
        };

        const response = await register.createUser(user);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Email\' deve ser um email válido');
    });

    test('Não deve cadastrar sem nome', async () => {
        const user = {
            email: 'costa&gmail.com',
            password: 'Senha123',
        };

        const response = await register.createUser(user);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Name\' é obrigatório');
    });

    test('Não deve cadastrar sem email', async () => {
        const user = {
            name: 'Danilo Costa',
            password: 'Senha123',
        };

        const response = await register.createUser(user);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Email\' é obrigatório');
    });

    test('Não deve cadastrar sem senha', async () => {
        const user = {
            name: 'Danilo Costa',
            email: 'costa@gmail.com',
        };

        const response = await register.createUser(user);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Password\' é obrigatório');
    });
});
