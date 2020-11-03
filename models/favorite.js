const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

//** create schema */
const favoriteSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    
    },
    campsite: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campsite',
    }]
    
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Favorite", favoriteSchema);