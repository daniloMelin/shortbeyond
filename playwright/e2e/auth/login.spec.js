import { test, expect } from '@playwright/test';

import { authService } from '../../support/services/auth.js';

import { getUser } from '../../support/factories/user';


test.describe('POST /auth/login', () => {

    let auth;

    test.beforeEach(({ request }) => {
        auth = authService(request);
    });

    test('deve realizar o login com sucesso quando as credenciais são válidas', async () => {
        const user = getUser();

        const respCreate = await auth.createUser(user);
        expect(respCreate.status()).toBe(201);

        const response = await auth.login(user);
        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'Login realizado com sucesso');
        expect(body.data).toHaveProperty('token');
        expect(body.data.user).toHaveProperty('id');
        expect(body.data.user).toHaveProperty('name', user.name);
        expect(body.data.user).toHaveProperty('email', user.email);
        expect(body.data.user).not.toHaveProperty('password');
    });

    test('deve retornar erro 401 quando a senha é inválida', async () => {
        const user = getUser();

        const respCreate = await auth.createUser(user);
        expect(respCreate.status()).toBe(201);

        user.password = 'senhaerrada';

        const response = await auth.login(user);
        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'Credenciais inválidas');
    });

    test('deve retornar erro 401 quando o email não esta cadastrado', async () => {
        const user = getUser();

        user.email = 'emailerrado@example.com';

        const response = await auth.login(user);
        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'Credenciais inválidas');
    });

    test('deve retornar erro 400 quando o email não é informado', async () => {
        const user = {
            password: 'senha123'
        };

        const response = await auth.login(user);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Email\' é obrigatório');
    });

    test('deve retornar erro 400 quando a senha não é informada', async () => {
        const user = {
            email: 'email@example.com'
        };

        const response = await auth.login(user);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'O campo \'Password\' é obrigatório');
    });
});