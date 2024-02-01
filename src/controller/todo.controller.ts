import Task from "../models/task.model";
import Subtask from "../models/subtask.model";
type ReqBlog = {
  body: any;
  params: any;
};

function random(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

// controller to add task
export const addTask = async (req: ReqBlog, res: any) => {
  const { title, description, dueDate } = req.body;
  const taskpost = await Task.findOne({ title, deleted:false });
  if (taskpost) {
    res.status(409).json({ error: "task already exists", data: taskpost });
    return;
  }
  const taskId = random(10000, 20000);
  const createTask = await Task.create({ title, description,task_id:taskId , due_date:dueDate});

  if (!createTask) {
    res.status(500).json({ error: "could not create task" });
    return;
  }
  await res.status(200).json({ data: createTask });
};

export const addSubTask = async (req: ReqBlog, res: any) => {
    const { title, description, dueDate, taskId } = req.body;
    const subTaskId = random(100,999);
    const taskpost:any = await Task.findOneAndUpdate({ task_id:parseInt(taskId), deleted:false }, {"$push":{subtasks: subTaskId}}, {new:true});
    if (!taskpost) {
      res.status(500).json({ error: "could not update task collection please check the taskId" });
      return;
    }
    
    const createSubTask = await Subtask.create({ id:subTaskId,title, description,task_id:taskpost?.task_id , due_date:dueDate});
  
    if (!createSubTask) {
      res.status(500).json({ error: "could not create sub task" });
      return;
    }
    await res.status(200).json({ data: createSubTask });
  };

  // Controller to get all tasks
export const getAllBlogPost = async (req: ReqBlog, res: any) => {
  
  const blogposts = await Task.find({});
  if (!blogposts) {
    res.status(500).json({ error: "Error occoured to get all blog posts" });
  }
  await res.status(200).json({ data: blogposts });
};

// get task by id
export const getBlogPostById = async (req: ReqBlog, res: any) => {
  const postId = req.params.id;
  const blogpost = await Task.findById(postId, {deleted:false});
  if (!blogpost) {
    res.status(404).json({ error: "could not find blog post" });
  }
  await res.status(200).json({ data: blogpost });
};

// update task by id
export const updateBlogPostById = async (req: ReqBlog, res: any) => {
  const postId = req.params.id;
  const  updateBody  = req.body;
  const blogpost = await Task.findByIdAndUpdate(postId, updateBody, {new:true});
  if (!blogpost) {
    res.status(404).json({ error: "could not find blog post" });
  }
  await res.status(200).json({ data: blogpost });
};

// delete task by updating deleted boolean to true
export const deleteBlogPost = async (req: ReqBlog, res: any) => {
  const postId = req.params.id;
  const blogpost = await Task.findByIdAndUpdate(postId, {deleted:true}, {new:true});
  if (!blogpost) {
    res.status(404).json({ error: "could not find blog post" });
  }
  await res.status(200).json({ data: blogpost });
};