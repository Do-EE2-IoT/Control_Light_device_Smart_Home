import ManufactorService from "../services/manufactor.service.js";

class ManufactorController {
  // Sign up new device ID
  signupDeviceInfo = async (req, res, next) => {
    console.log("[POST] :: Sign up device Infor :: ", req.body);
    return res.status(201).json(await ManufactorService.signupDevice(req.body));
  };

  getAllDevices = async (req, res, next) => {
    return res.status(200).json(await ManufactorService.getAllDeviceInfo());
  };

  getDeviceInfo = async (req, res, next) => {
    console.log("[GET] Device ID :: ", req.body?.ID);
    res.status(200).json(await ManufactorService.getDeviceInfo(req.body?.ID));
  };

  assignDevice = async (req, res, next) => {
    console.log("[POST] Device ID, User ID :: ", req.body);
    res.status(200).json(await ManufactorService.assignDevice(req.body));
  };

  deleteDevice = async (req, res, next) => {
    console.log("[DELETE] Device ID ::", req.body?.ID);
    return res.status(200).json(await ManufactorService.deleteDevice(req.body?.ID));
  };
}

export default new ManufactorController();
