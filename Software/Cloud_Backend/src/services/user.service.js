import ErrorResponse from "../helpers/errorHandle.response.js";
import UserModel from "../models/user.model.js";
import getInfoData from "../utils/index.js";

const findUserByEmail = async ({ email }) => {
  return await UserModel.findOne({ email: email });
};

const findUserByID = async (userId) => {
  return await UserModel.findById(userId);
};

export { findUserByEmail, findUserByID };

class UserServices {
  getUser = async (req) => {
    const userID = await req.get("CLIENT_ID");
    const userFounded = await findUserByID(userID);
    if (!userFounded) {
      throw new ErrorResponse("User Not Found", 403);
    }
    return getInfoData({ object: userFounded, fields: ["name", "email"] });
  };
}

export default new UserServices();
