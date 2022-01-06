const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const informSchema = new Schema({
  idOwner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: {
    type: String,
    required: true,
  },
  idType: { type: Schema.Types.ObjectId, ref: "TypeInform", required: true },
  content: {
    type: String,
    required: true,
  },
  classify: { type: String, required: true },
  createdAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Inform", informSchema);
