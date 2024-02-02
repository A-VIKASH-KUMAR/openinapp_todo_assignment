import express from "express";
import {
  addTask,
  addSubTask,
  getAllTasks,
  getAllSubTasks,
  updateTaskById,
  updateSubTaskById,
  deleteTask,
  deleteSubTask
} from "../controller/todo.controller";
import {
  validateCreate,
  validateCreateSubTask
} from "../middlewares/todo.validate";

const router = express.Router();

// task routes
router.post("/task", validateCreate, addTask);
router.post("/sub-task", validateCreateSubTask, addSubTask);
router.get("/task",getAllTasks);
router.get("/sub-task",getAllSubTasks);
router.get("/sub-task/:id",getAllSubTasks);
router.get("/task/:id",getAllTasks);
router.put("/task/:id",updateTaskById);
router.put("/sub-task/:id",updateSubTaskById);
router.delete("/task/:id",deleteTask);
router.delete("/sub-task/:id",deleteSubTask);

export default router;
