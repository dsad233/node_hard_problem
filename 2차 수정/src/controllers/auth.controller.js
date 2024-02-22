import { authServices } from "../services/auth.services.js";

export class authController {
    authservices = new authServices();
    genertoken = async (req, res) => {
        const { refreshToken } = req.body;
    
        const token = await this.authservices.usertoken(refreshToken);
        return res.json(token);
    }
}
