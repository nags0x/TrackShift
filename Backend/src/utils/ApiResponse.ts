class ApiResponse{
    status:number
    message:string
    data?:object
    constructor(status:number,message:string="Task Performed Successfully",data?:object){
        this.status = status
        this.message = message
        this.data = data
    }
}

export { ApiResponse };
