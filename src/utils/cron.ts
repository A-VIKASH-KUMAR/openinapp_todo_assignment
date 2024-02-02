import cron from "node-cron";
import Task from "../models/task.model";
import User from "../models/user.model";
import twilio from "twilio";
export const priorityNumber = (date: Date) => {
  const dateNum = new Date(date).getDate();
  const dateDiff = dateNum - new Date().getDate();

  switch (dateDiff) {
    case 0:
      return 0;

    case 1:
      return 1;

    case 2:
      return 1;

    case 3:
      return 2;

    case 4:
      return 2;

    default:
      return 3;
  }
};

export const nodeCron = async () => {
  cron.schedule("* * * * *", async () => {
    console.log("running a task every minute");
    try {
      const currentDate = new Date();
      const tasksToUpdate = await Task.find({
        due_date: { $lte: currentDate },
      });
      console.log("tasks", tasksToUpdate);

      if (tasksToUpdate.length === 0) {
        console.log("no tasks to update");
        return null;
      }
      tasksToUpdate.forEach(async (task) => {
        const priorityNum = priorityNumber(task.due_date);
        // Save the updated task
        await task.updateOne({ priority: priorityNum });
      });

      console.log("Task priorities updated successfully");
    } catch (error) {
      console.error("Error updating task priorities:", error);
    }
  });
};

export const twilioCalls = async () => {
  try {
    const currentDate = new Date();

    // Find tasks with due dates that have passed
    const overdueTasks = await Task.find({ due_date: { $lt: currentDate } });

    // Sort tasks by priority
    overdueTasks.sort((a: any, b: any) => b.priority - a.priority);

    // Iterate over tasks and make voice calls
    for (let i = 0; i < overdueTasks.length; i++) {
      const user: any = await User.findById(overdueTasks[i]._id);
      const phoneNumber: string = user?.phone_number ?? "";
    // const phoneNumber = "+918179769540"

      // Initialize Twilio client
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhoneNumber: string = process.env.TWILIO_PHONE_NUMBER!;
      const client = twilio(accountSid, authToken);
      const voiceResponse = twilio.twiml.VoiceResponse;
      const response = new voiceResponse();
      // Make a Twilio voice call
      await client.calls.create({
        to: phoneNumber,
        from: twilioPhoneNumber,
        statusCallback: "http://localhost:3001/api/events",
        statusCallbackMethod: "POST",
        url: "https://twilio.com/openinapp_ankit/voice/",
        method: "GET",
      });
      console.log(`Voice call made to ${phoneNumber} for task `);
    }

    console.log("Voice calls made successfully");
  } catch (error) {
    console.error("Error making voice calls:", error);
  }
};
