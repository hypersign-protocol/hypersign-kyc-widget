export async function RequestHandler(url, method = 'GET', body = {}, headers = {}) {

    if (!url) {
        throw new Error('url must be passed to RequestHandler')
    }

    const options = {
        method
    }

    if (headers && Object.keys(headers).length > 0) {
        headers["content-type"] = "application/json"
        headers['Origin'] = window.location.origin

        options['headers'] = headers;
    }

    if (body && Object.keys(body).length > 0) {
        options['body'] = JSON.stringify(body)
    }
    const response = await fetch(url, {
        ...options
    })

    const json = await response.json();
    console.log(json)

    // error handling
    if (!response.ok) {
        console.log({ ok: response.ok, status: response.status })
        if (response.status != 200) {
            if (json.error && json.success == false) {
                const erro = json.error.details?.join(' ')
                // throw new Error(erro)
                return erro
            } else {
                // throw new Error(response.status)
                return response.status
            }
        }
    }

    // success handling
    if (json && json.data && json.success == true) {
        return json.data;
    }
}