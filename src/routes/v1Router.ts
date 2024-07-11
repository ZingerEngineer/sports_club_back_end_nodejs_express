import express from 'express'
import publicRouter from './publicRouter'
import privateRouter from './privateRouter'

const v1Router = express.Router()

v1Router.use('/', [publicRouter, privateRouter])

export default v1Router
