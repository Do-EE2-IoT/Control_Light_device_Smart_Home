import express from "express";
import asyncMiddlewareHandler from "../../services/middleware.service.js";
import manufactorController from "../../controllers/manufactor.controller.js";

const manufactorRouter = express.Router();

manufactorRouter
  .post("/signup", asyncMiddlewareHandler(manufactorController.signupDeviceInfo))
  .get("/alldevice", asyncMiddlewareHandler(manufactorController.getAllDevices))
  .get("/onedevice", asyncMiddlewareHandler(manufactorController.getDeviceInfo))
  .post("/assigndevice", asyncMiddlewareHandler(manufactorController.assignDevice))
  .delete("/deletedevice", asyncMiddlewareHandler(manufactorController.deleteDevice))

export default manufactorRouter;
