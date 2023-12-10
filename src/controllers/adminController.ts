import { Request, Response } from "express"
import Admin from "../models/Admin"
import argon2 from "argon2"

export const viewAdmin = async (req: Request, res: Response): Promise<any> => {
    const method = req.method;
    const {password, confpassword,...body } = req.body;
    try {
        if(method === 'GET') {  
            const admin = await Admin.findAll({
                attributes: {exclude: ["password", "rtoken", "roleId"]}
            })
            return res.status(200).json({
                data: admin
            })
        }else if(method === "POST"){
            const validateEmail = await Admin.findOne({
                where: { email: body.email }, 
                attributes: {exclude: ['password']}
            })
            if(validateEmail){
                return res.status(400).json({"message": "Email sudah terdaftar!!"})
            }
            if(password !== confpassword) {
                return res.status(400).json({"message": "Password dan confpassword tidak cocok"})
            }
            const hashpassword = await argon2.hash(password);
            const admin = await Admin.create({
            password: hashpassword,
            ...body
            })
            return res.status(200).json(admin)
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message": "server error"}) 
    }
}
