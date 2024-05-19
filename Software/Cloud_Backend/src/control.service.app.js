import compression from "compression";
import Express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import instanceMongoDB from "./databases/init.mongodb.js";
import { ControlServiceRouter } from "./routes/index.js";
import bodyParser from "body-parser";
import ErrorResponse from "./helpers/errorHandle.response.js";

const controlService = Express();

// init middleware **************************************
controlService.use(morgan("combined")); // System log: combined for product, dev for dev
controlService.use(helmet()); // Header protect
controlService.use(compression()); // Compress output
controlService.use(bodyParser.json()); // Parsing application/json
controlService.use(bodyParser.urlencoded({ extended: true })); // Parsing application/x-www-form-urlencoded
controlService.use(cors());

// init database ****************************************
instanceMongoDB; // Connect MongoDB

// init routers *****************************************
controlService.use("", ControlServiceRouter);

// Use for detected unknown URL *************************
controlService.use("*", (req, res, next) => {
  next(new ErrorResponse(` Can't find ${req.originalUrl} on this server`, 404));
});

// handling error ***************************************
controlService.use((err, req, res, next) => {
  res.status(err?.code || 500).json({
    status: err?.code || 500,
    message: err?.message || "Interal server handler",
    err: err?.name,
    stack: err?.stack,
  });
});

export default controlService;
