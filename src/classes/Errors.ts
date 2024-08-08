export class AuthError extends Error {
  statusCode: number
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
    this.statusCode = 401
  }
}

export class DatabaseError extends Error {
  statusCode: number
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseError'
    this.statusCode = 500
  }
}
