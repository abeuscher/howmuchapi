module.exports = (currentState) => {   
    let newRecord = {};
    newRecord.extraRecords=[];
    const transformState = (state) => {
        let output = {};
        Object.keys(state).map((key) => { 
            //console.log(key)
            if (state[key].ref!=undefined) {
               
                // Catch new fields in different rcord types and pull them out for entry separately
                if (state[key].newRecord && state[key].value != "") {                
                    newRecord.extraRecords.push({
                        type: state[key].ref,
                        key:key,
                        parent:state[key].parent,
                        record: {
                            title:state[key].value
                        }
                    })
                }
                else if (state[key].value) {
                    output[key] =  { 
                            ref: key,
                            _id: state[key].value 
                        }                     
                }
            }
            else if (state[key].type!=undefined) {

                // Assign Auto title to purchases. Definitely need a better way to do this.
                if (key=="title" && state.distributor.textValue!="") {
                    output[key]=String("Purchase of "+state.distributor.textValue+"'s "+state.product.textValue+" from "+state.dispensary.textValue)
                }
                else {
                    output[key] =  state[key].value 
                }
                
            }
            else if (typeof state[key]==='object') {
                output[key] =  transformState(state[key])
            }
        })
        return output;     
    }
    newRecord.mainRecord = transformState(currentState);
    return newRecord
}