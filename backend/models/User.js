const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},// impossible de s'inscrire plusieurs fois avec la même adresse mail
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);// on ne pourra pas avoir plusieurs utilisateurs avec la même adresse mail

module.exports = mongoose.model('User', userSchema);