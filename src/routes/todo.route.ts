import express from "express";
import {
  addTask,
  addSubTask
  //   getAllBlogPost,
  //   getBlogPostById,
  //   updateBlogPostById,
  //   deleteBlogPost,
} from "../controller/todo.controller";
import {
  validateCreate,
  validateCreateSubTask
//   validateGetBlogById,
//   validateUpdateBlogById,
//   validateDeleteBlogById,
} from "../middlewares/todo.validate";

const router = express.Router();

// task routes
router.post("/task", validateCreate, addTask);
router.post("/sub-task", validateCreateSubTask, addSubTask);
// router.get("/blog",getAllBlogPost);
// router.get("/blog/:id", validateGetBlogById, getBlogPostById);
// router.put("/blog/:id", validateUpdateBlogById, updateBlogPostById);
// router.delete("/blog/:id", validateDeleteBlogById, deleteBlogPost);

export default router;
