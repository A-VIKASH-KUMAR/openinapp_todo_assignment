import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user:{
      type:mongoose.Types.ObjectId,
      ref:"User"
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    due_date: {
      type: Date,
      default: Date.now,
    },
    priority:{
      type: Number,
      enum: [0, 1, 2, 3]
    },
    task_id:{
      unique:true,
      type: Number
    },
    status:{
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'DONE'],
      default: 'TODO'
    },
    subtasks: [{
      type: Number,
      ref: 'Subtask',
    }],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;