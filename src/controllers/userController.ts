import { Request, Response } from "express"
import User from "../models/User";

export const viewUser = async (req: Request, res: Response): Promise<any> => {
    const method = req.method;
    const {...body } = req.body;
    try {
        if(method === 'GET') {
            const users = await User.findAll({
                attributes: {exclude: ['password']}
            })
            return res.status(200).json({
            data: users,
        })
        }else if(method === 'POST'){
            const validateEmail = await User.findOne({where: { email: body.email }})
            if(validateEmail){
                return res.status(400).json({"message": "Email sudah terdaftar!!"})
            }
            const user = await User.create({
            ...body
            })
            return res.status(200).json(user)
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message": "Terjadi kesalahan di internal server!!"})
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
        return res.status(500).json({"message": "Internal server error!!"})  
    }
}