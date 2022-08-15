import * as jwt from 'jsonwebtoken'
import {Request,Response,NextFunction} from 'express'
import HttpException from '../exceptions/HttpException'
import RequestWithUser from '../interfaces/requestWithUser.interface'
import UserModel from '../user/user.model'

interface DataStoredInToken {
    _id: string;
  }


async function authMiddleware(req:RequestWithUser,res:Response,next:NextFunction){

    const authHeader = req.headers.authorization

    if(authHeader){
        
        try {

            const token = authHeader.split('Bearer ')[1]
       

        if(token){
            const verificationResponse = await jwt.verify(token, process.env.SECRET_KEY)  as DataStoredInToken

            const id = verificationResponse._id;
            
           
            const user = await UserModel.findById(id);  

            
            
            if(user){
                req.user = user
                
                return next()
            }
        
        
        }else{
            next(new HttpException(401,'Bearer token missing, login to perform operation'))
        }
            
        } catch (error) {
             next(error.message)
        }

        
    }else{
        next(new HttpException(401,'Authorization header missing, login to perform operation'))
    }

   


}


export default authMiddleware