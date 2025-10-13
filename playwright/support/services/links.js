
export const linksService = (request) => {
    const createLink = async (link, token) => {
        return await request.post('http://localhost:3333/api/links', {
            headers: {
                authorization: `Bearer ${token}`
            },
            data: link
        });
    }
    
    const getLinks = async (token) => {
        return await request.get('http://localhost:3333/api/links', {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
    }

    const deleteLinks = async (linkId, token) => {
        return await request.delete(`http://localhost:3333/api/links/${linkId}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
    }

    return {
        createLink,
        getLinks,
        deleteLinks
    }
}
