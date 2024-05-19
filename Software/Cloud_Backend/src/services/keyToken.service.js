import { configDotenv } from "dotenv";
import keyTokenModel from "../models/keyToken.model.js";
import jwt from "jsonwebtoken";
import ErrorResponse from "../helpers/errorHandle.response.js";
configDotenv();

const updateAccessToken = async (userId, accessToken) => {
  const filter = {
    user: userId,
  };

  const update = {
    accessToken: accessToken,
  };

  const options = {
    new: true,
    upsert: true
  };

  const updateToken = await keyTokenModel.findOneAndUpdate(
    filter,
    update,
    options
  );
  return updateToken;
};

const signTokenID = async (userID) => {
  return jwt.sign({ userId: userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export { signTokenID, updateAccessToken };
