class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = statusCode < 400
  }
}

module.exports = ApiResponse

//this will keep the shape of every api response same
