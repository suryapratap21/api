const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { refreshTokenLife } = require("../config/keys");

const tokenSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 120,
    default: Date.now,
  },
});

module.exports = mongoose.model("tokens", tokenSchema);
