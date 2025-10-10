import { test, expect } from '@playwright/test';

import { authService } from '../../support/services/auth.js';

import { linksService } from '../../support/services/links.js';

import { getUserWithLink } from '../../support/factories/user.js';

test.describe('Post /api/links', () => {

    const user =  getUserWithLink();
    let auth;
    let link;
    let token;

    test.beforeEach(async({ request }) => {
        auth = authService(request);
        link = linksService(request);
        await auth.createUser(user);
        token = await auth.getToken(user);
    });

    test('deve encurtar uma URL quando enviada via body', async() => {
        const response = await link.createLink(user.link, token);

        expect(response.status()).toBe(201);

        const { data, message } = await response.json();

        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('original_url', user.link.original_url);
        expect(data.short_code).toMatch(/^[a-zA-Z0-9]{5}$/);
        expect(data).toHaveProperty('title', user.link.title);
        expect(message).toBe('Link criado com sucesso');
    });

    test('Deve retornar erro 400 quando a url não for enviada', async() => {
        const response = await link.createLink({}, token);

        expect(response.status()).toBe(400);

        const { message } = await response.json();
        expect(message).toBe('O campo \'OriginalURL\' é obrigatório');
    });

    test('Deve retornar erro 400 quando o título não for enviado', async() => {
        const response = await link.createLink({ original_url: user.link.original_url }, token);

        expect(response.status()).toBe(400);

        const { message } = await response.json();
        expect(message).toBe('O campo \'Title\' é obrigatório');
    });

    test('Deve retornar erro 400 quando a url for inválida', async() => {
        const response = await link.createLink({ original_url: 'teste@gmail.com', title: user.link.title }, token);

        expect(response.status()).toBe(400);

        const { message } = await response.json();
        expect(message).toBe('O campo \'OriginalURL\' deve ser uma URL válida');
    });

});
