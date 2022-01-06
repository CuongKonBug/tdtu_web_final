const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const typeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("TypeInform", typeSchema);
