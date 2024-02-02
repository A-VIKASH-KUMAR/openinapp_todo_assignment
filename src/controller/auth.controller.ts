import User from "../models/user.model";
import bcrypt from "bcryptjs";
import addNewToken from "../utils/token";

// controller to register new user
export const register = async (req:any, res:any) => {
    const { ...authBody } =  req.body;
    const { username ="" } = authBody;
    const userIfExists = await User.findOne({username})
    if (userIfExists) {
        return res.status(409).json({error:"user already exists", data:userIfExists});
        
    }
    const password = authBody.password ? { password: await bcrypt.hash(authBody.password, 10) } : {};

    delete authBody.password;

    const createUser = await User.create({username, ...password, phone_number:authBody.phoneNumber, ...authBody});

    if (!createUser) {
        return res.status(500).json({error:"unable to register user please try again later"});
    }
    res.status(200).json({message:"User Registered successfully", data:createUser});
}

// Function to login
export const login = async (req:any, res:any) => {
    const {username, password} = req.body;
    
    const userIfExists:any = await User.findOne({username})
    if (!userIfExists) {
        return res.status(500).json({error:"invalid username"});
    }
    
    const isMatch = await bcrypt.compare(password, userIfExists?.password);
    if (!isMatch) {
        return res.status(409).json({ status: "forbidden", message: "Password doesn't match!" });
    }
    
    const getUser:any = await User.findById(userIfExists._id);
    if (!getUser) {
        return res.status(404).json({ status: "error", message: `User not found please register to continue` });
      }

      addNewToken(req, res, getUser);
      const { refresh = "", access = "" } = res.locals;
      return res.status(200).json({
        status: "success",
        message: "Login Successful.",
        data: [userIfExists],
        access,
        refresh
      });
    
}