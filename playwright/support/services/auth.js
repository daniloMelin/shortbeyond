
export const authService = (request) => {

    const createUser = async(user) => {
        return await request.post('http://localhost:3333/api/auth/register', {
            data: user
        });
    }

    const login = async(user) => {
        return await request.post('http://localhost:3333/api/auth/login', {
            data: {
                email: user.email,
                password: user.password
            }
        });
    }

    const getToken = async(user) => {
        const response = await login(user);
        const body = await response.json();

        return body.data.token;
    }

    return {
        createUser,
        login,
        getToken
    }
}
