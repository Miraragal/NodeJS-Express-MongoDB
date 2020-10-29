const mongoose = require("mongoose");
// mongoose.plugin((schema) => {
//   schema.options.usePushEach = true;
// });
 const Schema = mongoose.Schema;


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});


//** create and export model */
module.exports = mongoose.model("User", userSchema);