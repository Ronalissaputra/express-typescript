import { Request, Response } from "express"
import User from "../models/User";
import argon2 from "argon2"

export const viewUser = async (req: Request, res: Response): Promise<any> => {
    const method = req.method;
    const {password, confpassword,...body } = req.body;
    try {
        if(method === 'GET') {            
            const users = await User.findAll({
                attributes: {exclude: ['password', 'rtoken', 'roleId']},
            })
            return res.status(200).json({
            data: users,
        })
        }else if(method === 'POST'){
            const validateEmail = await User.findOne({
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
            const user = await User.create({
            password: hashpassword,
            ...body
            })
            return res.status(200).json(user)
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message": "server error"})
    }
}

export const viewUserById = async (req:Request, res: Response): Promise<any> => {
    const method = req.method;
    const id = req.params.id;
    const {...body} = req.body;
    try {
        if(method === 'GET'){
            const user = await User.findByPk(id, {
                attributes: { exclude: ['password']}
            })
            if(!user) {
                return res.status(400).json({"message": "User tidak ditemukan"})
            }
            return res.status(200).json({
                data: user
            })
        }else if(method === 'PATCH'){
            const user = await User.findByPk(id)
            if(!user) {
                return res.status(400).json({"message": "User tidak ditemukan"})
            }
            await user.update({
                ...body
            })
            return res.status(201).json({"message": "Data berhasil di update"})
        }else if(method === "DELETE"){
            const user = await User.findByPk(id)
            if(!user) {
                return res.status(400).json({"message": "User tidak ditemukan"})
            }
            await user.destroy()
            return res.status(200).json({"message": "User berhasil dihapus"})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message": "server error"})  
    }
}