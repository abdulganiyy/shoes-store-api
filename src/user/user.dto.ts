import { IsString } from "class-validator";

class createUserDto {
    @IsString()
    public username:string
    @IsString()
    public firstname:string
    @IsString()
    public lastname:string
    @IsString()
    public email:string
    @IsString()
    public password:string
    @IsString()
    public photo:string
    @IsString()
    public role:string
}

export default createUserDto