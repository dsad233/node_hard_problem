import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";

export default async function (req, res, next) {
  try {
    const { acess_token } = req.cookies;
    if (!acess_token) throw new Error("요청한 사용자의 토큰이 존재하지 않음");

    const [tokenType, token] = acess_token.split(" ");
    if (tokenType !== "Bearer")
      throw new Error("토큰 타입이 Bearer 형식이 아닙니다");

    const decodedtoken = jwt.verify(token, "secret-key");
    const userId = decodedtoken.userId;

    const user = await prisma.users.findFirst({
      where: { userId: parseInt(userId) },
    });

    if (!user) throw new Error("해당 유저 토큰은 존재하지 않습니다");


    req.user = user;




    next();
  } catch (error) {
    if (error.name == "TokenExpireError")
      return res.status(401).json({ Message: "토큰이 만료되었습니다." });
    if (error.name === "JsonWebTokenError")
      return res.status(401).json({ Message: "토큰이 조작되었습니다." });

    return res.status(400).json({ Message: error.Message });
  }
}
