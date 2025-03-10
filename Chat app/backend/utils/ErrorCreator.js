class HttpError extends Error {
    constructor() {
        super();
    }
    create(stat, msg, code){
        this.statusText = stat;
        this.message = msg;
        this.statusCode = code;
        return this;
    }
}

const ErrorCreator =  new HttpError();

export default ErrorCreator;