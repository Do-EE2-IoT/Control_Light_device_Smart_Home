import UserService from "../services/user.service.js"

class userController {
    getUserInfo = async (req, res, next) => {
        console.log("[GET] :: user ::", req.body)
        return res.status(200).json(await UserService.getUser(req))
    }
}

export default new userController