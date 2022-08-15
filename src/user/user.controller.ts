import * as express from 'express'
import Controller from '../interfaces/Controller'
import validationMiddleware from '../middlewares/validation.middleware'
import createUserDto from './user.dto'
import  * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import UserModel from './user.model'
import UserAlreadyExistsException from '../exceptions/UserAlreadyExistsException'
import HttpException from '../exceptions/HttpException'

class User implements Controller{
    path ='/user'
    router = express.Router()
    UserModel = UserModel

    constructor(){
         this.initializeRoutes()
    }

    private initializeRoutes = () => {

        this.router.get(`${this.path}`,this.getUsers)

        this.router.get(`${this.path}/:id`,this.getUser)

        this.router.delete(`${this.path}/:id`,this.deleteUser)

        this.router.post(`${this.path}/register`,validationMiddleware(createUserDto,true),this.register)

        this.router.post(`${this.path}/login`,validationMiddleware(createUserDto,true),this.login)

    }

    private register = async (req:express.Request,res:express.Response,next:express.NextFunction) => {

          try {

            const {email,password} = req.body
            const user = await this.UserModel.findOne({email})

            if(user){
                return next(new UserAlreadyExistsException(email))
            }else{

                const hashedPassword = await bcrypt.hash(password,10)
            const newUser = new this.UserModel({
                ...req.body,
                password:hashedPassword
            })

            const savedUser = await newUser.save()

            savedUser.password = undefined

            const token = jwt.sign({
                _id: savedUser._id
              }, process.env.SECRET_KEY, { expiresIn: '1h' })
            
              res.status(201).json({
                status:'success',
                token,
                user:savedUser
              })
            

            }

            
          } catch (error) {
            
            next(new HttpException(500,`Internal server error`))
          }
    }

    private login = async (req:express.Request,res:express.Response,next:express.NextFunction) => {

        try {

            const {email,password} = req.body

            const user =await this.UserModel.findOne({email})

            if(!user){
                next(new HttpException(404,'User does not exist'))
            }

            const isCorrectPassword = await bcrypt.compare(password,user.password)

            if(!isCorrectPassword){
                next(new HttpException(401,'Incorrect password'))
            }

            user.password = undefined

            const token = jwt.sign({
                _id: user._id
              }, process.env.SECRET_KEY, { expiresIn: '1h' })

            res.status(200).json({
                status:'success',
                token,
                user
            })
            
        } catch (error) {
            next(error.message)
        }
        
    }


    private getUsers = async (req:express.Request,res:express.Response,next:express.NextFunction) =>{
                 const users =await  this.UserModel.find()
                 
                 res.status(200).json({
                    status:'success',
                    users
                })
                 
    }

    private getUser = async (req:express.Request,res:express.Response,next:express.NextFunction) =>{
        const userId = req.params.id
        const user = await  this.UserModel.findById(userId)

        if(user){
            res.status(200).json({ 
                status:'success',
                user
            })
        }else{
            next(new HttpException(404,`User with ${userId} not found`))
        }
        
       
        
}


private deleteUser = async (req:express.Request,res:express.Response,next:express.NextFunction) =>{
    const userId = req.params.id
    const user = await  this.UserModel.findByIdAndDelete(userId)

    if(user){
        res.status(200).json({ 
            status:'success',
    
        })
    }else{
        next(new HttpException(404,`User with ${userId} not found`))
    }
    
   
    
}

}

export default User