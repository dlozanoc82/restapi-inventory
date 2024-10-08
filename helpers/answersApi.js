// Se crean estas funciones con el fin de generar un estandar de respuestas del backend
const successAnswer = ( req, res, message = '', statusCode = 200) => {
    res.status(statusCode).send({
        error: false,
        status: statusCode,
        body: message
    })
}

const errorAnswer = ( req, res, messageError = 'Error Interno', statusCode = 500) => {
    res.status(statusCode).send({
        error: true,
        status: statusCode,
        body: messageError
    })
}

export{
    successAnswer,
    errorAnswer
}
