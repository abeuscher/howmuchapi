function assignTypes(schema, record,formSchema) {
    // Assign types to new DB Record
    var output = {};
    let formFields = formSchema();
    Object.keys(schema).map((key) => {
        if (schema[key].name) {
            if (schema[key].name == "Date") {
                output[key] = { value: typeof record[key] === "date" ? new Date(record[key]) : new Date(), type: schema[key].name, formControl: formFields[schema[key].name] }
            }
            else {
                output[key] = { value: record[key] || "", type: schema[key].name, formControl: formFields[schema[key].name] }
            }
        }
        else if (key == "images") {
            output[key] = { value: typeof record[key] === 'object' ? record[key] : [], type: "images", formControl: formFields["Images"] }
        }
    });
    return output;
}
module.exports = assignTypes;
