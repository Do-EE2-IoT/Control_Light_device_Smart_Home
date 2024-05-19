import ErrorResponse from "../helpers/errorHandle.response.js";
import publishTopic from "../mqtt/publish.mqtt/index.js";
import DeviceModel from "../models/device.model.js";
import UserModel from "../models/user.model.js";
import getInfoData from "../utils/index.js";

const findByDeviceID = async (deviceID) => {
  return await DeviceModel.findOne({ ID: deviceID });
};

const DeleteDevicebyID = async (deviceID) => {
  return await DeviceModel.findByIdAndDelete(deviceID);
};

class DeviceService {
  getAllDeviceInfo = async (userID) => {
    var resData = [];
    // Check user exit?
    const ownUser = await UserModel.findById(userID);
    if (!ownUser) {
      throw new ErrorResponse("User doesn't exited!", 403);
    }

    // for (let index of ownUser.device) {
    //   resData.push(await findByDeviceID(index)); -> /?
    // }
    return {
      status: "success",
      devices: ownUser.device,
    };
  };

  getDeviceInfo = async ({ deviceID, userID }) => {
    // Check user exit?
    const ownUser = await UserModel.findById(userID);
    if (!ownUser) {
      throw new ErrorResponse("User doesn't exited!", 403);
    }
    // Check device in user
    if (ownUser.device.indexOf(deviceID) === -1) {
      throw new ErrorResponse("Device doesn't join!", 409);
    }
    // Check device exit?
    const holderDevice = await DeviceModel.findOne({ deviceID: deviceID });
    if (!holderDevice) {
      throw new ErrorResponse("Device doesn't exited!", 403);
    }
    return {
      status: "success",
      device: holderDevice,
    };
  };

  claimDevice = async ({ deviceID, userID }) => {
    // Check device exit?
    const holderDevice = await DeviceModel.findOne({ deviceID: deviceID });
    if (!holderDevice) {
      throw new ErrorResponse("Device doesn't exited!", 403);
    }
    // Check user exit?
    const ownUser = await UserModel.findById(userID);
    if (!ownUser) {
      throw new ErrorResponse("User doesn't exited!", 403);
    }
    // Check device in user
    if (ownUser.device.indexOf(deviceID) !== -1) {
      throw new ErrorResponse("Device already join!", 409);
    }
    // Push device
    let a = ownUser.device;
    a.push(deviceID);

    const ownUserUpdate = await UserModel.findByIdAndUpdate(
      userID,
      {
        device: a,
      },
      {
        new: true,
      }
    );
    if (!ownUserUpdate) {
      throw new ErrorResponse("Couldn't claim device", 500);
    }

    return {
      device: ownUserUpdate?.device,
    };
  };

  deleteDevice = async ({ deviceID, userID }) => {
    // Check user exit?
    const ownUser = await UserModel.findById(userID);
    if (!ownUser) {
      throw new ErrorResponse("User doesn't exited!", 403);
    }
    // Check device in user
    let a = ownUser.device;
    if (a.indexOf(deviceID) === -1) {
      throw new ErrorResponse("Device doesn't join!", 409);
    }
    // Remove device
    a.splice(a.indexOf(deviceID), 1);
    const ownUserUpdate = await UserModel.findByIdAndUpdate(
      userID,
      {
        device: a,
      },
      {
        new: true,
      }
    );

    return {
      device: ownUserUpdate?.device,
    };
  };

  // Coding convention
  controlDevice = async ({ deviceID, value }) => {
    
    const deviceControl = await DeviceModel.findOne({ deviceID: deviceID });

    if (!deviceControl) {
      throw new ErrorResponse(
        `Failed to control device : ${deviceControl.name}`
      );
    }

    const payload = {
      address: deviceID,
      value: value,
    };

    const ID = String(deviceControl.deviceID.replace(/^0x*/, ""));
    console.log(ID);
    // Mỗi nhà có một gateway và nó có ID là 0002 như này, networkkey là nhập trên app
    // để phân biệt mạng giữa các nhà và trên gateway cần đăng ký cho nó một clientID và password (MQTT riêng biệt)
    publishTopic(`/device/pub/ID=0002`, 1, JSON.stringify(payload));

    return {
      status: "success",
      requestControl:
        "Send command for device successfully, wait for update status",
    };
  };

  findDeviceandUpdate = async (deviceID, messageUpdate) => {
    console.log(deviceID);
    console.log(messageUpdate);
    try {
      const findDeviceandUpdate = await DeviceModel.findOneAndUpdate(
        {
          deviceID: deviceID,
        },
        {
          value: parseInt(messageUpdate.value),
        },
        { new: true }
      );
      if (!findDeviceandUpdate) {
        console.log("Broken");
      }
      console.log("success update");
    } catch (err) {
      console.log(err);
    }
  };

  // const worker = new Worker("./src/services/multithread.service.js");
  // worker.on("message", async (message) => {
}

export default new DeviceService();
