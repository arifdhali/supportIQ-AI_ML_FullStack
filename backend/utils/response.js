const success = (res, data = {}, message = "success", statusCode = 200) => {

    return res.status(statusCode).json({
        status: true,
        message: message,
        data,
    });


}
const error = (res, errors = [], message = "error", statusCode = 500) => {

    return res.status(statusCode).json({
        status: false,
        message: message,
        errors,
    });

}

module.export = { success, error };