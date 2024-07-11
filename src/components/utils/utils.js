export async function RequestHandler(url, method = 'GET', body = {}, headers = {}, queryParams = {}) {

    if (!url) {
        throw new Error('url must be passed to RequestHandler')
    }

    const formattedUrl = new URL(url)

    // Params
    const allParams = Object.keys(queryParams)
    if (queryParams && allParams.length > 0) {
        allParams.forEach(key => {
            formattedUrl.searchParams.append(key, queryParams[key])
        })
    }

    const options = {
        method
    }

    // Headers
    if (headers && Object.keys(headers).length > 0) {
        headers["content-type"] = "application/json"
        headers['Origin'] = window.location.origin

        options['headers'] = headers;
    }

    // Body
    if (body && Object.keys(body).length > 0) {
        options['body'] = JSON.stringify(body)
    }

    const response = await fetch(formattedUrl.toString(), {
        ...options
    })

    const json = await response.json();

    // error handling
    if (!response.ok) {
        console.log({ ok: response.ok, status: response.status })
        if (response.status != 200) {
            if (json.error && json.success == false) {
                const erro = json.error.details?.join(' ')
                // throw new Error(erro)
                return erro
            } else if (json.error && json.message) {
                throw new Error(json.message)
            }
            else {
                // throw new Error(response.status)
                return response.status
            }
        }
    }

    // success handling
    if (json && json.data && json.success == true) {
        return json.data;
    } else if (json && json.status == 200 && json.message != null) {
        return json.message;
    }
}