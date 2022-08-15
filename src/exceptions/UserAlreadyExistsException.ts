import HttpException from "./HttpException";

class UserAlreadyExistsException extends HttpException {
    constructor(email:string){
        super(400,`user with email ${email} already exists`)
    }
}


export default UserAlreadyExistsException