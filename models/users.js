const mongoose = require('mongoose');
const passoprtLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passoprtLocalMongoose);
module.exports = mongoose.model('User', userSchema);