export const createSuccess = (responseCode, message, data) => {
    const res = {
        status: responseCode,
        message: message,
        data: data
    };

    return res;
}

export const createError = (responseCode, error, data) => {
    const err = new Error();
    err.stack = responseCode;
    err.message = error;

    return err;
}