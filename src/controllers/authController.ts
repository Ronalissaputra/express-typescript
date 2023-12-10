import { Request, Response } from "express"
import dotenv from "dotenv"
import User from "../models/User"
import argon2 from "argon2"
import jwt from "jsonwebtoken"
dotenv.config()

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
            const role = user?.role;

            const accessToken = jwt.sign(
                {userId, username, useremail, role},
                process.env.ACCESS_TOKEN_SECRET as string,
                {expiresIn: "10s"}
            )
            const refreshToken = jwt.sign(
            { userId, username, useremail, role },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "10s" }
            );

            await User.update(
                { rtoken: refreshToken },
                { where: {id: userId}}
            )

            res.cookie("refreshtoken", refreshToken, {
                httpOnly: true,
                secure: false,
                maxAge: 24 * 60 * 60 * 1000,
            })

            res.status(200).json({accessToken})
        }
        if(method === "DELETE"){
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
        return res.status(500).json({"message": "server error"})
    }
} 

export const viewToken = async (req:Request, res:Response): Promise<any> => {
    const refreshtoken: string = req.cookies.refreshtoken; 
    try {
        if(!refreshtoken) return res.sendStatus(401);
        const user = await User.findOne({where: {rtoken: refreshtoken}})
        if (!user) return res.sendStatus(401)
        jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, decoded: any) => {
            const userId = user?.id;
            const username = user?.username;
            const email = user?.email;
            const role = user?.role;
            const accesstoken = jwt.sign(
                { userId, username,email, role},
                process.env.ACCESS_TOKEN_SECRET as string,
                {expiresIn: "10s"}
            );
            res.json({accesstoken})
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message": "server error"})
    }
    
}

export const viewMe = async (req:Request, res:Response): Promise<any> => {
    const { email } = req.body.email;
    console.log(email);
}