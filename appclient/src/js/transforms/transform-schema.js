function parseSchema (obj) {
    let output = {};
    if (obj.created!=undefined) {
        delete obj.created;
    }
    Object.keys(obj).map(function (key) {
        if (typeof obj[key] === 'object') {
            output[key] = key == "images" ? [] : parseSchema(obj[key]);
        }
        else if (typeof obj[key] === 'function') {
            output[key] = {
                value: "",
                type: obj[key].name
            }
        }
    });
    return output;
}
module.exports = parseSchema