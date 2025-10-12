import { test, expect } from '../../support/fixtures';

import { getUserWithLink } from '../../support/factories/user.js';


test.describe('Post /api/links', () => {

    const user =  getUserWithLink();
 
    let token;

    test.beforeEach(async({ auth }) => {
        await auth.createUser(user);
        token = await auth.getToken(user);
    });

    test('deve encurtar uma URL quando enviada via body', async( { links }) => {
        const response = await links.createLink(user.link, token);

        expect(response.status()).toBe(201);

        const { data, message } = await response.json();

        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('original_url', user.link.original_url);
        expect(data.short_code).toMatch(/^[a-zA-Z0-9]{5}$/);
        expect(data).toHaveProperty('title', user.link.title);
        expect(message).toBe('Link criado com sucesso');
    });

    test('Deve retornar erro 400 quando a url não for enviada', async( { links }) => {
        const response = await links.createLink({}, token);

        expect(response.status()).toBe(400);

        const { message } = await response.json();
        expect(message).toBe('O campo \'OriginalURL\' é obrigatório');
    });

    test('Deve retornar erro 400 quando o título não for enviado', async( { links }) => {
        const response = await links.createLink({ original_url: user.link.original_url }, token);

        expect(response.status()).toBe(400);

        const { message } = await response.json();
        expect(message).toBe('O campo \'Title\' é obrigatório');
    });

    test('Deve retornar erro 400 quando a url for inválida', async( { links }) => {
        const response = await links.createLink({ original_url: 'teste@gmail.com', title: user.link.title }, token);

        expect(response.status()).toBe(400);

        const { message } = await response.json();
        expect(message).toBe('O campo \'OriginalURL\' deve ser uma URL válida');
    });

});
