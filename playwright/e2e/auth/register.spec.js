import { expect, test } from '@playwright/test';

import { getUser } from '../../support/factories/user';

import { authService } from '../../support/services/auth.js';

test.describe('POST /auth/register', () => {

    let auth;

    test.beforeEach(({ request }) => {
        auth = authService(request);
    });

    test('deve cadastrar um novo usuário com sucesso quando os dados são válidos', async () => {
        const user = getUser();

        const response = await auth.createUser(user);
        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'Usuário cadastrado com sucesso!');

        expect(body.user).toHaveProperty('id');
        expect(body.user).toHaveProperty('name', user.name);
        expect(body.user).toHaveProperty('email', user.email);
        expect(body.user).not.toHaveProperty('password');
    });

    test('deve retornar erro 400 quando o email já está em uso', async () => {
        const user = getUser();

        const preCondition = await auth.createUser(user);
        expect(preCondition.status()).toBe(201);

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'Este e-mail já está em uso. Por favor, tente outro.');
    });

    test('deve retornar erro 400 quando o email é inválido', async () => {
        const user = {
            name: 'Danilo Costa',
            email: 'costa&gmail.com',
            password: 'Senha123',
        };

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Email\' deve ser um email válido');
    });

    test('deve retornar erro 400 quando o nome não é informado', async () => {
        const user = {
            email: 'costa@gmail.com',
            password: 'Senha123',
        };

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Name\' é obrigatório');
    });

    test('deve retornar erro 400 quando o email não é informado', async () => {
        const user = {
            name: 'Danilo Costa',
            password: 'Senha123',
        };

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Email\' é obrigatório');
    });

    test('deve retornar erro 400 quando a senha não é informada', async () => {
        const user = {
            name: 'Danilo Costa',
            email: 'costa@gmail.com',
        };

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Password\' é obrigatório');
    });
});
