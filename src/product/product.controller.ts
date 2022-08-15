import * as express from 'express'
import Controller from '../interfaces/Controller'
import validationMiddleware from '../middlewares/validation.middleware'
import createProductDto from './product.dto'
import authMiddleware from '../middlewares/auth.middleware'
import RequestWithUser from 'interfaces/requestWithUser.interface'
import ProductModel from './product.model'
import HttpException from '../exceptions/HttpException'


// Import the functions you need from the SDKs you need
import { storage } from "../server";
import {  ref, uploadString,getDownloadURL } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB2PQcEZyloATx8VKN38BAjeb2VDdbEFCQ",
//   authDomain: "sneakers-533c6.firebaseapp.com",
//   projectId: "sneakers-533c6",
//   storageBucket: "sneakers-533c6.appspot.com",
//   messagingSenderId: "718440546303",
//   appId: "1:718440546303:web:4692e1bb93348a8c26f1ca"
// };

// Initialize Firebase
//const app = initializeApp(firebaseConfig);


// Initialize Cloud Storage and get a reference to the service
//const storage = getStorage(app);




class Product implements Controller{
    path ='/product'
    router = express.Router()
    ProductModel=ProductModel

    constructor(){
         this.initializeRoutes()
    }

    private initializeRoutes = () => {

        this.router.get(`${this.path}`,this.getProducts)
        this.router.get(`${this.path}/:id`,this.getProduct)

        this.router.post(`${this.path}`,validationMiddleware(createProductDto),authMiddleware,this.createProduct)

        this.router.delete(`${this.path}`,this.deleteProducts)

        this.router.delete(`${this.path}/:id`,this.deleteProduct)




    }

    private createProduct = async (req:RequestWithUser,res:express.Response,next:express.NextFunction) => {

       try {

                //const storage = getStorage();
                const photos = req.body.photos as string[]
                const imageUrls = await Promise.all(photos.map((image, i) => {
                    const storageRef = ref(
                    storage,
                    `ImagesOfProducts/${Date.now}/image${i}`
                    );
                    return uploadString(storageRef, image, "data_url", {
                    contentType: "image/jpg",
                    }).then(() => {
                    return getDownloadURL(storageRef);
                    });
                }))

                //console.log(imageUrls)

                const newProduct = new this.ProductModel({
                    ...req.body,
                    photos:imageUrls,
                    owner:req.user._id
                })


                const savedProduct = await newProduct.save()

                res.status(201).json({
                    status:'success',
                    product:savedProduct
                })

       

        
       } catch (error) {

        next(error.message)
        
       }

}


    private getProducts = async (req:express.Request,res:express.Response,next:express.NextFunction) =>{
        const products =await  this.ProductModel.find()
        
        res.status(200).json({
           status:'success',
           products
       })
        
}

private getProduct = async (req:express.Request,res:express.Response,next:express.NextFunction) =>{
    const productId = req.params.id
    const product = await  this.ProductModel.findById(productId)

    if(product){
        res.status(200).json({ 
            status:'success',
            product
        })
    }else{
        next(new HttpException(404,`User with ${productId} not found`))
    }
    
}

private deleteProduct = async (req:express.Request,res:express.Response,next:express.NextFunction) =>{
    const productId = req.params.id
    const product = await  this.ProductModel.findByIdAndDelete(productId)

    if(product){
        res.status(200).json({ 
            status:'success',
    
        })
    }else{
        next(new HttpException(404,`User with ${productId} not found`))
    }
    
   
    
}

private deleteProducts = async (req:express.Request,res:express.Response,next:express.NextFunction) =>{
    const products = await  this.ProductModel.deleteMany()

    if(products){
        res.status(200).json({ 
            status:'success',
    
        })
    }else{
        next(new HttpException(404,`products not found`))
    }
    
   
    
}

   

}

export default Product