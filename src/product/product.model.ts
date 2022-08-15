import mongoose, {Schema,model} from 'mongoose';
import Product from './product.interface';

const productSchema = new Schema({
    title:String,
    description:String,
    photos:[String],
    discount:Number,
    price:Number,
    category:String,
    brand:String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
})


const ProductModel = model<Product & mongoose.Document>('Product',productSchema)

export default ProductModel