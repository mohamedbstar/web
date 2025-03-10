class ProductError extends Error {
    constructor() {
        super();
    }

    create(status, msg, code){
        this.statusText = status;
        this.message = msg;
        this.statusCode = code;
        return this;
    }
}

export default new ProductError();