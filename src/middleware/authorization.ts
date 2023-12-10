import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"

const expiredTokens = new Set<string>()
export const Authorization = (req: Request,res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    if(expiredTokens.has(token)) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, decoded:any) => {
        if (err) return res.sendStatus(403);
            (req as any).id = decoded.id;
            (req as any).username = decoded.username;
            (req as any).email = decoded.email;
            (req as any).roleId = decoded.roleId;   
        next();
  });
}