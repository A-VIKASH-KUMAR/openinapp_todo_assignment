import { access } from "fs";
import jwt from "jsonwebtoken";

interface UpdatedUser {
    _id?: string;
    phone_number?:string;
    type?: string;
    fname?: string;
    googleId?: string;
    role?: string;
    picture?: string;
    auth?: any;
  }
  
  type Request = {
    user: UpdatedUser;
    type: any;
  };

export default function (req: Request, res: any, updatedUser: UpdatedUser) {
    let jwtSignValue: any = {
      _id: updatedUser._id,
      phoneNumber:updatedUser.phone_number
    };
  
    // // Check if the mobile/email field exists in updatedUser and add it to jwtSignValue if true
    // const mobileAuth: any = updatedUser.auth.find((auth: any) => auth.type === "mobile");
    // if (mobileAuth?.mobile) {
    //   jwtSignValue.mobile = mobileAuth.mobile;
    // }
  
    // const emailAuth = updatedUser.auth.find((auth: any) => auth.type === "email");
  
    // if (emailAuth?.email) {
    //   jwtSignValue.email = emailAuth.email;
    // }
  
    // const googleAuth = updatedUser.auth.find((auth: any) => auth.type === "google");
  
    // if (googleAuth?.googleId) {
    //   jwtSignValue.googleId = googleAuth.googleId;
    //   jwtSignValue.photo.url = googleAuth.picture;
    // }
  
    let accessToken = jwt.sign(jwtSignValue, process.env.JWT_SECRET_KEY!, {
      expiresIn: "5m",
    });
  
    let refreshToken = jwt.sign(jwtSignValue, process.env.JWT_SECRET_KEY!, {
      expiresIn: "24h",
    });
    console.log("accesss", accessToken);
    
    // Attach tokens to the response locals object for further use
    res.locals.access = accessToken;
    res.locals.refresh = refreshToken;
  
    req.user = jwtSignValue;
    // return res.locals;
  }
  