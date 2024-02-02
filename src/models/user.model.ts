import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  phone_number: {
    type: String, 
  },
  priority: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 0,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: Number,
      ref: "Task",
    },
  ],
});

const user =  mongoose.model("User", userSchema);

export default user;