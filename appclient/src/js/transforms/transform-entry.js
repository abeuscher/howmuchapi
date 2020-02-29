function transformEntry(state, record) {
    var output = {};
    Object.keys(state).map((key, idx) => {
        if (state[key].type != undefined) {
            if (state[key].type == "Date") {
                output[key] = { value: new Date(record[key]), type: state[key].type }
            }
            else {
                output[key] = { value: record[key], type: state[key].type }
            }
        }
        else {
            output[key] = record[key]
        }
    });
    return output;
}
module.exports = transformEntry;
