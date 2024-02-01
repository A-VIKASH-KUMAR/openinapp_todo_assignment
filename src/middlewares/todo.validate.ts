export const validateCreate = async (req: any, res: any, next: any) => {
    const { title,  description } = req.body;
    if (
      !title ||
      !description ||
      title === "" ||
      description === ""
    ) {
      await res.status(403).json({
        error: "please provide title, description of the blog post",
      });
      return;
    }
    return next();
  };

  export const validateCreateSubTask = async (req: any, res: any, next: any) => {
    const { title,  description, taskId } = req.body;
    if (
      !title ||
      !description ||
      !taskId  ||
      title === "" ||
      description === "" ||
      taskId === "" 
    ) {
      await res.status(403).json({
        error: "please provide title, description, taskId  of the blog post",
      });
      return;
    }
    return next();
  };