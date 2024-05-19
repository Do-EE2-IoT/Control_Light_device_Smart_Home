import ErrorResponse from "../helpers/errorHandle.response.js";
import DeviceModel from "../models/device.model.js";
import publishTopic from "../mqtt/publish.mqtt/index.js";

const findDeviceID = async (deviceID) => {
  return await DeviceModel.findById(deviceID);
};

const findByDeviceID = async (deviceID) => {
  return await DeviceModel.findOne({ID: deviceID});
};

const DeleteDevicebyID = async (deviceID) => {
  return await DeviceModel.findByIdAndDelete(deviceID);
};

class ManufactorService {
  signupDevice = async ({ name, deviceID, type }) => {
    // Check device type
    let value = null;
    switch (type) {
      case 1:
        value = { state: 0 };
        break;
      default:
        throw new ErrorResponse("Type doesn't exist",404)
    }
    // Check device exit?
    const holderDevice = await DeviceModel.findOne({ deviceID: deviceID }).lean({});
    if (holderDevice) {
      console.log(holderDevice);
      throw new ErrorResponse("Device exited!", 403);
    }
    const newDevice = await DeviceModel.create({
      name: name,
      deviceID: deviceID,
      type: type,
      value: value,
    });
    if (!newDevice) {
      throw new ErrorResponse("can't not sign up for this device", 404);
    }

    return {
      status: "success",
      device: newDevice,
    };
  };

  getAllDeviceInfo = async () => {
    const devices = await DeviceModel.find();
    if (!devices) {
      throw new ErrorResponse("Can't find any device in your location", 404);
    }
    return {
      status: "success",
      devices: devices,
    };
  };

  getDeviceInfo = async (deviceID) => {
    console.log("device ID:: ", deviceID);
    const deviceFound = await findDeviceID(deviceID);

    if (!deviceFound) {
      throw new ErrorResponse("Device Not Found", 403);
    }

    return {
      status: "success",
      device: deviceFound,
    };
  };

  assignDevice = async ({deviceID, userID}) => {
    // Check device exit?
    const holderDevice = await findByDeviceID(deviceID)
    if (!holderDevice) {
      throw new ErrorResponse("Device doesn't exited!", 403);
    }
    // Check user exit?
    const ownUser = await UserModel.findById(userID);   
    if (!ownUser) {
      throw new ErrorResponse("User doesn't exited!", 403);
    }
    // Check device in user
    if (ownUser.device.indexOf(deviceID) !== -1){
      throw new ErrorResponse("Device already join!", 409);
    }
    // Push device
    let a = ownUser.device
    a.push(deviceID)

    const ownUserUpdate = await UserModel.findByIdAndUpdate(userID, {
      device : a
    },
    {
      new: true
    })
    if (!ownUserUpdate) {
      throw new ErrorResponse("Couldn't claim device", 500);
    }

    return {
      device: ownUserUpdate?.device,
    };
  };

  deleteDevice = async (deviceID) => {
    const deviceExist = findDeviceID(deviceID);
    if (!deviceExist) {
      throw new ErrorResponse("Not exist this device, check again", 404);
    }
    const deviceWillDelete = await DeleteDevicebyID(deviceID);
    if (!deviceWillDelete) {
      throw new Error("Can't delete this device", 404);
    }
    console.log("Hello")
    return {
      status: "success",
      deviceDelete: deviceWillDelete,
    };
  };
}

export default new ManufactorService();
