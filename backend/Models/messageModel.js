const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    contentType: { type: String, trim: true, default: "text" },
    fileContent: { type: String, trim: true, default: "" },
    mimeType: { type: String, trim: true },
    fileName: { type: String, trim: true, default: "" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageModel);
module.exports = Message;
