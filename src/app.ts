import * as express from 'express'
import * as cors from 'cors';
import Controller from "./interfaces/Controller";
import errorMiddleware from './middlewares/error.middleware';
import * as mongoose from 'mongoose'

class App {
    app:express.Application;
    constructor(controllers:Controller[]){
        this.app = express()
        this.initializeDatabase()
        this.initializeMiddlewares()
        this.initializeRoutes(controllers)
        this.initializeErrorHandling()
    }

    private initializeDatabase(){
       mongoose.connect(process.env.MONGOURI).then(()=>{
        console.log('Connected to database successfully')
       }).catch(()=>{
        console.log('Connection to database failed')
       })

    }

    private initializeMiddlewares(){
        this.app.use(cors())
        this.app.use(express.json({limit: '200mb'}));
        this.app.use(express.urlencoded({limit: '200mb', extended: true}));

    }

    private initializeRoutes(controllers:Controller[]){
         controllers.forEach((controller) => {
            this.app.use(controller.router)
         })
    }

    private initializeErrorHandling(){
        this.app.use(errorMiddleware)   
    
    }

    public listen(){
           this.app.listen(process.env.PORT,()=>{
            console.log(`Server running on port ${process.env.PORT}`)
           })
    }
}


export default  App