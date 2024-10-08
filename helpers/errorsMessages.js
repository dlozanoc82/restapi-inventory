import { errorAnswer } from "./answersApi.js";

export default function errorsMessages(err,req,res,next){
    console.error('[error]', err);

    const message = err.message || 'Error Interno';
    const status = err.statusCode || 500;

    errorAnswer(req,res,message,status);
}

