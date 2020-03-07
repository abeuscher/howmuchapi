module.exports = (thisSchema, thisRecord, formSchema) => {
    // Assign types to new DB Record

    const formFields = formSchema();
    if (thisSchema.created) {
        delete thisSchema.created
    }
    const parseSchema = (schema, record) => {
        let output = {};
        Object.keys(schema).map((key) => {
            if (schema[key].type != undefined) {
                if (schema[key].type.name == "Date") {
                    output[key] = {
                        value: record[key] ? new Date(record[key]) : new Date(),
                        type: schema[key].type.name,
                        label: schema[key].default || "",
                        formControl: formFields[schema[key].type.name]
                    }
                }
                else if (schema[key].type.name == "Number") {
                    output[key] = {
                        value: record[key] ? record[key] : "",
                        type: schema[key].type.name,
                        label: schema[key].default || "",
                        min: schema[key].min || -1,
                        max: schema[key].max || -1,
                        formControl: formFields[schema[key].type.name]
                    }
                }
                else {
                    output[key] = {
                        value: record[key] ? record[key] : "",
                        type: schema[key].type.name,
                        label: schema[key].default || "",
                        formControl: formFields[schema[key].type.name]
                    }
                }
            }
            else if (key == "images") {
                output[key] = {
                    value: typeof record[key] === 'object' ? record[key] : [],
                    type: "images",
                    formControl: formFields["Images"]
                }
            }
            else if (typeof schema[key] == 'object') {
                output[key] = parseSchema(schema[key], record[key] ? record[key] : {})
            }
        });
        return output
    }
    return parseSchema(thisSchema, thisRecord);
}
