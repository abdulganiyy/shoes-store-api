import { IsString,IsInt,IsArray } from "class-validator";

class createProductDto {
    @IsString()
    public title:String
    @IsString()
    description:String
    @IsArray()
    photos:[String]
    @IsInt()
    discount:Number
    @IsInt()
    price:Number
    @IsString()
    category:String
    @IsString()
    brand:String
    
}

export default createProductDto