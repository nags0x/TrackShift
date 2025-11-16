class ApiError extends Error {
    status: number
    override stack?: string | undefined
    success?:boolean
    constructor(status: number, success?:boolean, message?: string , stack?: string ) {
        super(message)
        this.status = status
        this.success=success
        if (stack) {    
             this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)

        }
    }
    
}
export {ApiError}