const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  idOwner: { type: Schema.Types.ObjectId, ref: "User", required: true },

  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
});
module.exports = mongoose.model("Comment", commentSchema);
