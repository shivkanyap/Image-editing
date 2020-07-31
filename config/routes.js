const express=require('express')
const router=express.Router()
const {usersRouter}=require('../app/controllers/UsersController')
const {taskformRouter}=require('../app/controllers/TaskController')



router.use('/users',usersRouter)
router.use('/taskform',taskformRouter)
module.exports={
    routes:router
}