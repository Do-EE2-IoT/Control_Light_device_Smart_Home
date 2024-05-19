import DeviceService from "../services/device.service.js";

class DeviceController {
  claimDeviceInfo = async (req, res, next) => {
    console.log("[POST] :: Claim device Infor :: ", req.body);
    return res.status(201).json(await DeviceService.claimDevice(req.body));
  };

  getAllDevices = async (req, res, next) => {
    console.log("[GET] All Device Infor :: ");
    const userID = await req.get("CLIENT_ID");
    return res.status(200).json(await DeviceService.getAllDeviceInfo(userID));
  };

  getDeviceInfo = async (req, res, next) => {
    console.log("[GET] Device Infor :: ", req.params.id);
    const deviceInfo = {
      deviceID: req.params.id,
      userID: await req.get("CLIENT_ID"),
    };
    return res.status(200).json(await DeviceService.getDeviceInfo(deviceInfo));
  };

  claimDeviceInfo = async (req, res, next) => {
    console.log("[POST] :: Claim device Infor :: ", req.body);
    return res.status(201).json(await DeviceService.claimDevice(req.body));
  };

  deleteDevice = async (req, res, next) => {
    console.log("[DELETE] device ::", req.body);
    return res.status(200).json(await DeviceService.deleteDevice(req.body));
  };

  controlDevice = async (req, res, next) => {
    console.log("[CONTROL device ::", req.body);
    return res.status(200).json(
      await DeviceService.controlDevice({
        deviceID:req.params.id,
        value: req.body.value,
      })
    );
  };
}

export default new DeviceController();
