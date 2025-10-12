import { test  as _baseTest, expect } from '@playwright/test';
import { authService } from '../services/auth.js';
import { linksService } from '../services/links.js';

const test = _baseTest.extend({
    auth: async({ request }, use) => {
        await use(authService(request));
    },
    links: async({ request }, use) => {
        await use(linksService(request));
    },
});

export { test, expect };