import mongoose, {Schema,model} from 'mongoose';
import User from './user.interface';

const userSchema = new Schema({
    username:String,
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    photo:String,
    role:String,
},{
    timestamps:true
})


const UserModel = model<User & mongoose.Document>('User',userSchema)

export default UserModel;