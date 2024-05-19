import { configDotenv } from "dotenv";
import app from "./src/application.service.app.js";
import process from "process";
import followingService from "./src/following.service.app.js";
import controlService from "./src/control.service.app.js";
configDotenv();

const port = process.env.PORT || 3001;
const following_servicePort = process.env.FOLLOWING_SERVICE_PORT || 3002;
const control_servicePort = process.env.CONTROL_SERVICE_PORT || 3003;


const server_1 = app.listen(port, () => {
  console.log("Listening on port ", port);
});

const server_2 = followingService.listen(following_servicePort, () => {
  console.log("Listening on port ", following_servicePort);
});

const server_3 = controlService.listen(control_servicePort, () => {
  console.log("Listening on port ", control_servicePort);
});


process.on("SIGINT", () => {
  server_1.close(() => console.log("Server 1 exit!"));
  server_2.close(() => console.log("Server 2 exit!"));
  server_3.close(() => console.log("Server 3 exit!"));
});

