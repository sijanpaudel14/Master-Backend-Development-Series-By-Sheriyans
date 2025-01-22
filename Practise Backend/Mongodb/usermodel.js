// usermodel.js

const { default: mongoose, model } = require("mongoose")

mongoose.connect("mongodb://username:password@127.0.0.1:27017/mongopractice?authSource=admin", {
});
const userSchema = mongoose.Schema({
    name: String,
    username:String,
    email:String
})
module.exports = mongoose.model("user", userSchema);