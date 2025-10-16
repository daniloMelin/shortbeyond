
export const linksService = (request) => {
    const createLink = async (link, token) => {
        return await request.post('/api/links', {
            headers: {
                authorization: `Bearer ${token}`
            },
            data: link
        });
    }

    const createAndReturnLinkId = async (link, token) => {
        const response = await createLink(link, token);
        const body = await response.json();
        return body.data.id;
    }


    const getLinks = async (token) => {
        return await request.get('/api/links', {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
    }

    const deleteLinks = async (linkId, token) => {
        return await request.delete(`/api/links/${linkId}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
    }

    return {
        createLink,
        getLinks,
        deleteLinks,
        createAndReturnLinkId
    }
}
