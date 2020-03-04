let badKeys = ["blankEntry","uploading","paths"];

module.exports = (state) => {   
    console.log(state); 
    var output = {};
    Object.keys(state).map((key, idx) => { output[key] = state[key].type != undefined ? state[key].value : state[key] }); 
    console.log(output);
    return output;
}