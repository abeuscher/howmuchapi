var defaultFetchObject = {
    method: 'POST',
    headers: new Headers({
        'Content-Type': 'application/json'
    })
}
function apiConnector(path) {
    return fetch(path, Object.assign({},defaultFetchObject,{body: sendData}))
        .then(res => res.json())
}

apiConnector.prototype.update = function(sendData) {

}
apiConnector.prototype.getById = function(id) {
    let sendData = JSON.stringify({ "_id": id.toString() });
    return fetch(this.paths.read, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: sendData
    })
        .then(res => res.json())
}
apiConnector.prototype.getAll = function() {
    return fetch(this.paths.read, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(res => res.json())
}
apiConnector.prototype.createImage = function(e) {

    // Grab files from field.
    const files = Array.from(e.target.files)

    const formData = new FormData()

    // Add files to array inside of form object.
    files.forEach((file, i) => {
        formData.append("file", file)
    })

    // Upload images to default dir whie record is being edited. TODO: Make server side worker move images after record is added then upadte path. This might mean adding a download path to record.
    return fetch(this.paths.createImage, {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
}
apiConnector.prototype.createRecord = function(sendData){
    return fetch(this.paths.create, {
        "method": "POST",
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        "body": sendData
    })
    .then(res => res.json())
}
apiConnector.prototype.deleteRecord = function(id) {
    let sendData = JSON.stringify({ "id": id });
    return fetch(this.paths.delete, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: sendData
    })
        .then(res => res.json())
}
module.exports = apiConnector;