//  Create a model the same way we created the other models
const mongoose = require('mongoose');

// Inject authentication related functionality by injecting the passport module
const plm = require('passport-local-mongoose');


const schemaDefinition = {
    username: String,
    password: String,
    Create: Date
};

const userSchema = new mongoose.Schema(schemaDefinition);

// use plugin() to add functionality to our model 
//  this will expand the model to offer authentication related functionality 
userSchema.plugin(plm);



module.exports = new mongoose.model('User', userSchema);