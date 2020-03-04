function apiConnector(action, data, type) {

    let rootpath = "http://localhost:5000/";
    let paths = {
        createImage: rootpath + "create/image",
        create: rootpath + "create/" + type,
        read: rootpath + "get/" + type,
        update: rootpath + "update/" + type,
        delete: rootpath + "delete/" + type
    }

    //console.log("API Call: " + paths[action], data, type)
    if (action == "createImage") {

        // Grab files from field.
        const files = Array.from(data.target.files)

        const formData = new FormData()

        // Add files to array inside of form object.
        files.forEach((file) => {
            formData.append("file", file)
        })
        return fetch(paths[action], {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
    }
    else {
        return fetch(paths[action], Object.assign({}, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }, { body: data }))
            .then(res => res.json())
    }
}

module.exports=apiConnector