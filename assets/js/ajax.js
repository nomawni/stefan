

class Ajax {

    constructor(url, data, method) {

        this.url = url,
        this.data = data,
        this.method = method

    }
    fetchData() {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .catch(error => console.log(error))
        .then(response => console.log('Success : ', JSON.stringify(response)));
    }
}