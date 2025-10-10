
export const linksService = (request) => {
    const createLink = async (link, token) => {
        return await request.post('http://localhost:3333/api/links', {
            headers: {
                authorization: `Bearer ${token}`
            },
            data: link
        });
    }

    return {
        createLink
    }
}
