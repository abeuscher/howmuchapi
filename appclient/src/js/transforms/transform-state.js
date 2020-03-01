let badKeys = ["blankEntry","uploading","paths"];

module.exports = (state) => {    
    var output = {};
    Object.keys(state).map((key, idx) => { output[key] = state[key].type != undefined ? state[key].value : state[key] }); 
    badKeys.forEach(key => { if (output[key] != undefined) { delete output[key] } });
    return output;
}