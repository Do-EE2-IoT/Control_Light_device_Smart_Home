import Express from "express";
import instanceMongoDB from "./databases/init.mongodb.js";
import { mqttBrokerInit } from "./mqtt/init.mqtt.js";
import { subscribeTopic } from "./mqtt/subscribe.mqtt/index.js";

const followingService = Express();

// init database ****************************************
instanceMongoDB; // Connect MongoDB

//init MQTT*********************************************
mqttBrokerInit(); // connect to MQTT broker
subscribeTopic("/device/sub/+", 1);

export default followingService;
