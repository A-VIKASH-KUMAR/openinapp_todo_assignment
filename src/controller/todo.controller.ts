import Task from "../models/task.model";
import Subtask from "../models/subtask.model";
import mongoose from "mongoose";
import { priorityNumber } from "../utils/cron";
type Reqtask = {
  body: any;
  params: any;
  user: any;
  query: any;
};

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

// controller to add task
export const addTask = async (req: Reqtask, res: any) => {
  const { title, description, dueDate } = req.body;
  const userId = req.user._id;
  console.log("user id", userId);

  const priorityNum = priorityNumber(dueDate);
  const taskpost = await Task.findOne({ title, deleted: false });
  if (taskpost) {
    res.status(409).json({ error: "task already exists", data: taskpost });
    return;
  }
  const taskId = random(10000, 20000);
  const createTask = await Task.create({
    title,
    description,
    task_id: taskId,
    due_date: dueDate,
    user: userId,
    priority: priorityNum,
  });

  if (!createTask) {
    res.status(500).json({ error: "could not create task" });
    return;
  }
  await res.status(200).json({ data: createTask });
};

// Controller to add sub task
export const addSubTask = async (req: Reqtask, res: any) => {
  const { title, description, dueDate, taskId } = req.body;
  const userId = req.user._id;
  const subTaskId = random(100, 999);
  const taskpost: any = await Task.findOneAndUpdate(
    { task_id: parseInt(taskId), deleted: false },
    { $push: { subtasks: subTaskId } },
    { new: true }
  );
  if (!taskpost) {
    res.status(500).json({
      error: "could not update task collection please check the taskId",
    });
    return;
  }

  const createSubTask = await Subtask.create({
    user: userId,
    id: subTaskId,
    title,
    description,
    task_id: taskpost?.task_id,
    due_date: dueDate,
  });

  if (!createSubTask) {
    res.status(500).json({ error: "could not create sub task" });
    return;
  }
  await res.status(200).json({ data: createSubTask });
};

export const getAllTasks = async (req: Reqtask, res: any) => {
  const userId = req.user._id;
  const taskId = req.params.id;
  const query: any = { user: userId };
  const { priority, due_date } = req.query;
  console.log("params", req.query);
//   logic to handle taskid, priority, due date filter
  if (taskId) query.task_id = taskId;
  if (priority) query.priority = priority;
  if (due_date) query.due_date = { $lte: new Date(due_date) };
  console.log("query", query);

  const blogposts = await Task.find(query);
  if (!blogposts) {
    res.status(500).json({ error: "Error occoured to get all blog posts" });
  }
  await res.status(200).json({ data: blogposts });
};

export const getAllSubTasks = async (req: Reqtask, res: any) => {
  const userId = req.user._id;
  const taskId = req.params.id ?? "";
  const { status, due_date } = req.query;
  const query: any = { user: userId, task_id: taskId };

  //  logic to handle status or due date filter
  if (status) query.status = status;
  if (due_date) query.due_date = { $lte: new Date(due_date) };
  console.log("query", query);
  
  const blogposts = await Subtask.find(query);
  if (!blogposts) {
    return res.status(500).json({ error: "Error occoured to get all subtasks" });
  }
  return await res.status(200).json({ data: blogposts });
};

// update task by id
export const updateTaskById = async (req: Reqtask, res: any) => {
  const taskId = req.params.id;
  const { due_date, status } = req.body;
  const task = await Task.findOneAndUpdate(
    {task_id:taskId},
    { due_date, status },
    { new: true }
  );
  if (!task) {
    res.status(404).json({ error: "could not find task" });
  }
  await res.status(200).json({ data: task });
};

// update sub task by id
export const updateSubTaskById = async (req: Reqtask, res: any) => {
  const subTaskId = req.params.id;
  const { status } = req.body;
  const task = await Subtask.findOneAndUpdate(
    {id:subTaskId},
    { status },
    { new: true }
  );
  if (!task) {
    res.status(404).json({ error: "could not find blog post" });
  }
  await res.status(200).json({ data: task });
};

// delete task by updating deleted boolean to true
export const deleteTask = async (req: Reqtask, res: any) => {
  const taskId = req.params.id;
  const task = await Task.findOneAndUpdate(
    {task_id:taskId},
    { deleted: true, deleted_at: new Date() },
    { new: true }
  );
  if (!task) {
    res.status(404).json({ error: "could not find task" });
  }
  await res.status(200).json({ data: task });
};

// delete task by updating deleted boolean to true
export const deleteSubTask = async (req: Reqtask, res: any) => {
  const subTaskId = req.params.id;
  
  const subtask = await Subtask.findOneAndUpdate(
    {id:subTaskId},
    { deleted: true, deleted_at: new Date() },
    { new: true }
  );
  console.log("sub task", subtask);
  
  if (!subtask) {
    return res.status(404).json({ error: "could not find sub task" });
  }
  await res.status(200).json({ data: subtask });
};
