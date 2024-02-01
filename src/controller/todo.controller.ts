import Task from "../models/task.model";
import Subtask from "../models/subtask.model";
import { priorityNumber } from "../utils/cron";
type Reqtask = {
  body: any;
  params: any;
  user:any;
};

function random(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

// controller to add task
export const addTask = async (req: Reqtask, res: any) => {
  const { title, description, dueDate } = req.body;
  const userId = req.user._id
  const priorityNum = priorityNumber(dueDate)
  const taskpost = await Task.findOne({ title, deleted:false });
  if (taskpost) {
    res.status(409).json({ error: "task already exists", data: taskpost });
    return;
  }
  const taskId = random(10000, 20000);
  const createTask = await Task.create({ title, description,task_id:taskId , due_date:dueDate, user:userId, priority:priorityNum});

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
    const subTaskId = random(100,999);
    const taskpost:any = await Task.findOneAndUpdate({ task_id:parseInt(taskId), deleted:false }, {"$push":{subtasks: subTaskId}}, {new:true});
    if (!taskpost) {
      res.status(500).json({ error: "could not update task collection please check the taskId" });
      return;
    }
    
    const createSubTask = await Subtask.create({ user:userId, id:subTaskId,title, description,task_id:taskpost?.task_id , due_date:dueDate});
  
    if (!createSubTask) {
      res.status(500).json({ error: "could not create sub task" });
      return;
    }
    await res.status(200).json({ data: createSubTask });
  };

//   // Controller to get all tasks
// export const getAllTasksOfUser = async (req: Reqtask, res: any) => {
//   const userId = req.user._id;
//   const blogposts = await Task.find({user:userId});
//   if (!blogposts) {
//     res.status(500).json({ error: "Error occoured to get all blog posts" });
//   }
//   await res.status(200).json({ data: blogposts });
// };

export const getAllTasks = async (req: Reqtask, res: any) => {
    const userId = req.user._id;
    const {priority = 0, due_date = "" } = req.params;
    const blogposts = await Task.find({user:userId,$or:[{priority:{$eq:priority}}, {due_date :{$lte:due_date}}]});
    if (!blogposts) {
      res.status(500).json({ error: "Error occoured to get all blog posts" });
    }
    await res.status(200).json({ data: blogposts });
  };

// Controller to get all sub tasks of the task id
// export const getAllSubTasksOfUser = async (req: Reqtask, res: any) => {
//     const userId = req.user._id;
//     const taskId = req.params.id;
//     const blogposts = await Subtask.find({user:userId, task_id:taskId});
//     if (!blogposts) {
//       res.status(500).json({ error: "Error occoured to get all blog posts" });
//     }
//     await res.status(200).json({ data: blogposts });
//   };

  export const getAllSubTasks = async (req: Reqtask, res: any) => {
    const userId = req.user._id;
    const taskId = req.params.id;
    const {priority = "", due_date = "" } = req.params;
    const blogposts = await Subtask.find({task_id:taskId, user:userId,$or:[{priority:{$eq:priority}}, {due_date :{$le:due_date}}]});
    if (!blogposts) {
      res.status(500).json({ error: "Error occoured to get all blog posts" });
    }
    await res.status(200).json({ data: blogposts });
  };
// get task by id
export const getTaskById = async (req: Reqtask, res: any) => {
  const taskId = req.params.id;
  const blogpost = await Task.findById(taskId, {deleted:false});
  if (!blogpost) {
    res.status(404).json({ error: "could not find blog post" });
  }
  await res.status(200).json({ data: blogpost });
};

// update task by id
export const updateTaskById = async (req: Reqtask, res: any) => {
  const taskId = req.params.id;
  const  {due_date, status}  = req.body;
  const task = await Task.findByIdAndUpdate(taskId, {due_date, status}, {new:true});
  if (!task) {
    res.status(404).json({ error: "could not find blog post" });
  }
  await res.status(200).json({ data: task });
};

// delete task by updating deleted boolean to true
export const deleteBlogPost = async (req: Reqtask, res: any) => {
  const taskId = req.params.id;
  const blogpost = await Task.findByIdAndUpdate(taskId, {deleted:true}, {new:true});
  if (!blogpost) {
    res.status(404).json({ error: "could not find blog post" });
  }
  await res.status(200).json({ data: blogpost });
};