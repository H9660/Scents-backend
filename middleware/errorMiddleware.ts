export const errorMiddleware = (err:any, req:any, res:any, next:any) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)
    console.log("The status code is", statusCode)
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
  }

