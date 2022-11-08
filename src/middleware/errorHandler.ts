import { CustomError, ICustomError } from "../models/CustomError";

const errorHandler = (error: ICustomError, req: any, res: any, next: any) => {
    if(error instanceof CustomError) {
        return res.status(error.code).send({message: error.message});
    }
    return res.status(500).send({message: error.message});
}

export default errorHandler;