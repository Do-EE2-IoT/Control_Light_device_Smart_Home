import express from "express"
import asyncMiddlewareHandler from "../../services/middleware.service.js"
import userController from "../../controllers/user.controller.js"

const userRouter = express.Router()

userRouter
    .get('/me/info', asyncMiddlewareHandler(userController.getUserInfo))

export default userRouter