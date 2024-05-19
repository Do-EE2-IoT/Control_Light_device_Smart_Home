import mongoose from "mongoose"
import { password, username } from "../configs/configs.mongodb.js"

const mongoConnectionString = `mongodb+srv://${username}:${password}@cluster0.ob0weth.mongodb.net/Smarthome`
class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        mongoose.connect(mongoConnectionString, {
            maxPoolSize: 50
        })
            .then(_ => console.log('Connected MongoDB'))
            .catch(err => console.log('Error connect to', mongoConnectionString))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongoDB = Database.getInstance()

export default instanceMongoDB