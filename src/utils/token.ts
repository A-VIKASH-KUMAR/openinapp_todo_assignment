import { access } from "fs";
import jwt from "jsonwebtoken";

interface UpdatedUser {
    _id?: string;
    phone_number?:string;
  }
  
  type Request = {
    user: UpdatedUser;
  };

export default function (req: Request, res: any, updatedUser: UpdatedUser) {
    let jwtSignValue: any = {
      _id: updatedUser._id,
      phoneNumber:updatedUser.phone_number
    };
  
    let accessToken = jwt.sign(jwtSignValue, process.env.JWT_SECRET_KEY!, {
      expiresIn: "5m",
    });
  
    let refreshToken = jwt.sign(jwtSignValue, process.env.JWT_SECRET_KEY!, {
      expiresIn: "24h",
    });
    
    // Attach tokens to the response locals object for further use
    res.locals.access = accessToken;
    res.locals.refresh = refreshToken;
  
    req.user = jwtSignValue;
  }
  