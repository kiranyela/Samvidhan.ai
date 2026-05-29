class ApiResponse{
    constructor(statusCode, message="success", data){
        this.statusCode = statusCode;
        this.success = typeof statusCode === "number" && statusCode >= 200 && statusCode < 400;
        this.message = message;
        this.data = data;
    }
}

export {ApiResponse};