class ApiError extends Error{
    constructor(
        status,
        messages,
        Error
    ) {
        this.status = status 
        this.messages = messages
        this.Error = Error || null;
    }
}

export { 
    ApiError 
}