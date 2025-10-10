import { test, expect } from '@playwright/test';

import { authService } from '../../support/services/auth.js';

import { linksService } from '../../support/services/links.js';

import { getUserWithLink } from '../../support/factories/user.js';

test.describe('Post /api/links', () => {

    test('deve encurtar uma URL quando enviada via body', async({ request }) => {

        const auth = authService(request);
        const link = linksService(request);

        const user = getUserWithLink();
        await auth.createUser(user);

        const token = await auth.getToken(user);
        const response = await link.createLink(user.link, token);

        expect(response.status()).toBe(201);

        const { data, message } = await response.json();

        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('original_url', user.link.original_url);
        expect(data.short_code).toMatch(/^[a-zA-Z0-9]{5}$/);
        expect(data).toHaveProperty('title', user.link.title);
        expect(message).toBe('Link criado com sucesso');
    });

});
