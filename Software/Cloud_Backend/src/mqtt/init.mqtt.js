import mqtt from "mqtt";
import dotenv from "dotenv";
import deviceService from "../services/device.service.js";

dotenv.config();
var mqttClient;

function mqttBrokerInit() {
  const hostURL = `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`;
  const options = {
    keepalive: 60,
    protocolID: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTomeout: 30 * 1000,
  };

  mqttClient = mqtt.connect(hostURL, options);

  mqttClient.on("reconnect", () => {
    console.log(hostURL);
    console.log("Reconnecting...");
  });

  mqttClient.on("connect", () => {
    console.log("MQTT Client connected");
  });

  mqttClient.on("message", async (topic, message, packet) => {
    console.log(
      "Received Message: " + message.toString() + "\nOn topic: " + topic
    );
    let partID = topic.split("ID=");
    let deviceID = "0x" + partID[1];
    const messageUpdate = JSON.parse(message.toString());
    await deviceService.findDeviceandUpdate(deviceID, messageUpdate);
  });
}

export { mqttBrokerInit, mqttClient };
