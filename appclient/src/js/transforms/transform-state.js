let badKeys = ["blankEntry","uploading","paths"];

module.exports = (currentState) => {   
    const transformState = (state) => {
        let output = {};
        Object.keys(state).map((key, idx) => { 
            if (state[key].type!=undefined) {
                output[key] =  state[key].value 
            }
            else if (typeof state[key]==='object') {
                output[key] =  transformState(state[key])
            }
        })
        return output;
        
    }
    return transformState(currentState)
}