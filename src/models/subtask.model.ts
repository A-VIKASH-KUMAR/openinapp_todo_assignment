import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    id: {
      type: Number,
      required: true,
    },
    task_id: {
      type: Number,
      unique: true,
      required: true,
    },
    due_date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0- incomplete, 1- complete
      default: 0,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Subtask = mongoose.model("Subtask", subtaskSchema);

export default Subtask;
