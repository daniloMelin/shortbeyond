import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('POST /auth/register', () => {
    test('Deve registrar um novo usuário com sucesso', async ({ request }) => {

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        const user = {
            name: `${firstName} ${lastName}`,
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            password: 'Senha123',
        };

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
});
