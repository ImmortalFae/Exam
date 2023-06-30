const BASE_URL = 'https://fakestoreapi.com'

export const getProducts = async () => {
    const response = await fetch(`${BASE_URL}/products`).then((res) => {
        return res.json()
    }).then((data) => {
        return data
    })

    return response
}

export const getProduct = async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`).then((res) => {
        return res.json()
    }).then((data) => {
        return data
    })

    return response
}
