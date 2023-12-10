import { Request, Response } from "express"
import dotenv from "dotenv"
import User from "../models/User"
import Admin from "../models/Admin"
import argon2 from "argon2"
import jwt from "jsonwebtoken"
dotenv.config()

export const viewAuthuser = async (req: Request, res: Response): Promise<any> => {
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
            const roleId = user?.roleId;

            const accessToken = jwt.sign(
                {userId, username, useremail, roleId},
                process.env.ACCESS_TOKEN_SECRET as string,
                {expiresIn: "10s"}
            )
            const refreshToken = jwt.sign(
            { userId, username, useremail, roleId },
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
}; 

export const viewAuthadmin = async (req: Request, res: Response): Promise<any> => {
    const method = req.method;
    const { email, password } = req.body;
    try {
        if(method === "POST"){
            const admin = await Admin.findOne({where: { email }})
            if(!admin) return res.status(400).json({"message": "Admin tidak ditemukan"});
            const verify = await argon2.verify(admin.password, password);
            if(!verify) return res.status(400).json({"message": "Password salah!!"});

            const adminId = admin?.id;
            const username = admin?.username;
            const adminemail = admin?.email;
            const roleId = admin?.roleId;

            const accessToken = jwt.sign(
                {adminId, username, adminemail, roleId},
                process.env.ACCESS_TOKEN_SECRET as string,
                {expiresIn: "10s"}
            )
            const refreshToken = jwt.sign(
            { adminId, username, adminemail, roleId },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "10s" }
            );

            await Admin.update(
                { rtoken: refreshToken },
                { where: {id: adminId}}
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
            
            const admin = await Admin.findOne({
                where: {rtoken: refreshtoken}
            })
            if(!admin) return res.sendStatus(204);
            const adminId = admin.id;

            await Admin.update(
                { rtoken: null },
                { where: {id: adminId}}
            )

            res.clearCookie("refreshtoken");
            return res.status(200).json({"message": "Berhasil logout"})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message": "server error"})
    }
}; 

export const viewTokenadmin = async (req:Request, res:Response): Promise<any> => {
    const refreshtoken: string = req.cookies.refreshtoken; 
    try {
        if(!refreshtoken) return res.sendStatus(401);
        const admin = await Admin.findOne({where: {rtoken: refreshtoken}})
        if (!admin) return res.sendStatus(401)
        jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, decoded: any) => {
            const adminId = admin?.id;
            const username = admin?.username;
            const email = admin?.email;
            const roleId = admin?.roleId;
            const accesstoken = jwt.sign(
                { adminId, username,email, roleId},
                process.env.ACCESS_TOKEN_SECRET as string,
                {expiresIn: "10s"}
            );
            res.json({accesstoken})
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message": "server error"})
    }
    
};

export const viewTokenuser = async (req:Request, res:Response): Promise<any> => {
    const refreshtoken: string = req.cookies.refreshtoken; 
    try {
        if(!refreshtoken) return res.sendStatus(401);
        const user = await User.findOne({where: {rtoken: refreshtoken}})
        if (!user) return res.sendStatus(401)
        jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, decoded: any) => {
            const userId = user?.id;
            const username = user?.username;
            const email = user?.email;
            const roleId = user?.roleId;
            const accesstoken = jwt.sign(
                { userId, username,email, roleId},
                process.env.ACCESS_TOKEN_SECRET as string,
                {expiresIn: "10s"}
            );
            res.json({accesstoken})
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message": "server error"})
    }
    
};

export const viewMe = async (req:Request, res:Response): Promise<any> => {
    const { email } = req.body.email;
    console.log(email);
};