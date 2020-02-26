var mongoose = require('mongoose');
 
var userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
            firstName: String,
        lastName: String
    },
    email: String,
    created: { 
        type: Date,
        default: Date.now
    }
});
 
var User = mongoose.model('User', userSchema);
 
module.exports = User;