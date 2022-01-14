const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  taskname: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
    maxlength: [20, "name can not be more than 20 characters"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: { type: String}
});

module.exports = mongoose.model("Task", TaskSchema);
