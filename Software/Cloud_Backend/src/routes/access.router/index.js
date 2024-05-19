import express from "express"
import accessController from "../../controllers/access.controller.js"
import asyncMiddlewareHandler from "../../services/middleware.service.js"

const accessRouter = express.Router()

accessRouter
    .post('/user/signup', asyncMiddlewareHandler(accessController.signup))
    .post('/user/login', asyncMiddlewareHandler(accessController.login))

export default accessRouter