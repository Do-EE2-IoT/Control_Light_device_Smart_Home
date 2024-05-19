import mongoose from "mongoose"
import os from 'os'
import process from "process"

const _SECONDS_RECHECK_CONNECTION = 60

const checkConnect = () => {

    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCore = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        const maxConnection = numCore * 10
        console.log(`Number connection :: ${numConnection}`)
        console.log(`Memory Usage      :: ${memoryUsage / 1024 / 1024} MB`)
        if (maxConnection < numConnection) {
            console.log("Overload detected!")
        }

    }, _SECONDS_RECHECK_CONNECTION)
}

export default checkConnect