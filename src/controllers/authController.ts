import { Request, Response } from "express"
import dotenv from "dotenv"
dotenv.config()
import User from "../models/User"
import argon2 from "argon2"
import jwt from "jsonwebtoken"

export const viewAuth = async (req: Request, res: Response): Promise<any> => {
    const method = req.method;
    const { email, password } = req.body;
    try {
        if(method === "POST"){
            const user = await User.findOne({where: { email }})
            if(!user) return res.status(400).json({"message": "User tidak ditemukan"});
            const verify = await argon2.verify(user.password, password);
            if(!verify) return res.status(400).json({"message": "Password salah!!"});

            const userId = user?.id;
            const username = user?.username;
            const useremail = user?.email;

            const accessToken = jwt.sign(
                {userId, username, useremail},
                process.env.ACCESS_TOKEN_SECRET || "",
                {expiresIn: "1h"}
            )
            const refreshToken = jwt.sign(
            { userId, username, useremail },
            process.env.REFRESH_TOKEN_SECRET || "",
            { expiresIn: "1d" }
            );

            await User.update(
                { rtoken: refreshToken },
                { where: {id: userId}}
            )

            res.cookie("refreshtoken", refreshToken, {
                httpOnly: true,
                // secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            })

            res.status(200).json({accessToken})
        }
        if(method === "DELETE"){
            if (!req.cookies || !req.cookies.refreshtoken) return res.sendStatus(204);
            const refreshtoken = req.cookies.refreshtoken;
            if(!refreshtoken) return res.sendStatus(204);
            
            const user = await User.findOne({
                where: {rtoken: refreshtoken}
            })
            if(!user) return res.sendStatus(204);
            const userId = user.id;

            await User.update(
                { rtoken: null },
               { where: {id: userId}}
            )

            res.clearCookie("refreshtoken");
            return res.status(200).json({"message": "Berhasil logout"})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message": "Internal server error"})
    }
} 