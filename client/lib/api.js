
export default class Api {
    url;
    constructor(url) {
        this.url = url;
    }
    call(method, data, responseType) {
        return fetch(this.url, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'X-Method': method
            },
            body: data.serializeBinary()})
            .then(r => {
                let status = r.headers.get('X-Status');
                if (status === null) {
                    return r.text().then(t => {throw t;});
                }
                return r.arrayBuffer();
            })
            .then(t => {
                return responseType.deserializeBinary(new Uint8Array(t));
            });
    }
};
