import express from "express";
import asyncMiddlewareHandler from "../../services/middleware.service.js";
import deviceController from "../../controllers/device.controller.js";

const deviceRouter = express.Router();

deviceRouter
  .post("/claim", asyncMiddlewareHandler(deviceController.claimDeviceInfo))
  .get("/alldevice", asyncMiddlewareHandler(deviceController.getAllDevices))
  .get("/onedevice/:id", asyncMiddlewareHandler(deviceController.getDeviceInfo))
  .patch("/control/:id", asyncMiddlewareHandler(deviceController.controlDevice));

export default deviceRouter;
