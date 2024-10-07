// Se crean estas funciones con el fin de generar un estandar de respuestas del backend
const success = ( req, res, message = '', statusCode = 200) => {
    res.status(statusCode).send({
        error: false,
        status: statusCode,
        body: message
    })
}

const error = ( req, res, messageError = 'Error Interno', statusCode = 500) => {
    res.status(statusCode).send({
        error: true,
        status: statusCode,
        body: messageError
    })
}

export{
    success,
    error
}
