import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import ErrorResponse from "../helpers/errorHandle.response.js";
import { findUserByEmail } from "./user.service.js";
import { signTokenID, updateAccessToken } from "./keyToken.service.js";
import keyTokenModel from "../models/keyToken.model.js";

class accessUserService {
  login = async ({ email, password }) => {
    // Check email
    const foundUser = await findUserByEmail({ email });
    if (!foundUser) {
      throw new ErrorResponse("User not registed", 403);
    }

    // Check password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      throw new ErrorResponse("Authentication Error", 403);
    }

    const tokens = await signTokenID(foundUser._id);
    const update = await updateAccessToken(foundUser._id, tokens);
    if(!update){
      throw new ErrorResponse("Cannot update token to server", 404);
    }
    return {
      userId: foundUser._id,
      token: tokens,
    };
  };

  signup = async ({ name, email, password }) => {
    // Check email exit?
    const holderUser = await UserModel.findOne({ email: email }).lean({});
    if (holderUser) {
      throw new ErrorResponse("User exited!", 201);
    }

    // Encrypt password by hash with salt = 10
    const passwordHash = await bcrypt.hash(password, 10);

    // Save to MongoDB
    const newUser = await UserModel.create({
      name: name,
      email: email,
      password: passwordHash,
    });

    if (newUser) {
      return { newUser_name: newUser.name };
    } else {
      throw new ErrorResponse("Couldn't completed", 401);
    }
  };
}

export default new accessUserService();
