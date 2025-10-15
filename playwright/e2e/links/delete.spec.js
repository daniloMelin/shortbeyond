import { test, expect } from "../../support/fixtures";

import { getUserWithLinks } from "../../support/factories/user";

import { ulid } from "ulid";

test.describe('DELETE /links/:id', () => {
    const user = getUserWithLinks();

    let token;

    test.beforeEach(async ({ auth }) => {
        await auth.createUser(user);
        token = await auth.getToken(user);

    });

    test('deve excluir um link com sucesso quando o ID é válido e o usuário está autenticado', async ({ links }) => {
        const linkId = await links.createAndReturnLinkId(user.links[0], token);

        const response = await links.deleteLinks(linkId, token);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.message).toBe('Link excluído com sucesso');
    });

    test('deve exibir erro quando tentar deletar um link encurtado que não existe', async ({ links }) => {
        const nonExistentId = ulid();

        const response = await links.deleteLinks(nonExistentId, token);
        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.message).toBe('Link não encontrado');
    });
});