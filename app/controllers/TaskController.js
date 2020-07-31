const express=require('express')
const router=express.Router()
const {Task}=require('../models/Task')
const {authenticateUser}=require('../middeleware/authentication')
const { adminAccess } = require('../middeleware/access')
const _ =require('lodash')

const multer = require ('multer')
const storage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads")
        
    },
    filename:function(req,file,cb){
        cb(null,Number(new Date())+ '_' +file.originalname)
    }
    
})

const fileFilter = (req,file,cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const upload = multer({
    storage, 
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter
})


router.post('/create',authenticateUser, adminAccess,upload.single('receipt'),(req,res,next)=>{
    const body=req.body
    if(req.file){
        body.receipt = req.file.path
    }
    else{
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }

    const taskform=new Task(body)
    taskform.save()
    .then(taskform=>res.send(taskform))
    .catch(err=>res.send(err))
    
})

// to update/ upload  the task pic by the individual user
router.put("/edit/pic/:id",authenticateUser,upload.single('receipt'),async(req,res)=>{
    const id=req.params.id
   
    const loggedinUser=req.user._id
    let form=await Task.findById(id)
    if(!form){
        return res.send({error:"form does not exist"})
    }
    else{
        if(loggedinUser.toString()!==form.assignedTo.toString()){
            return res.send({error:'logged in user and assigned user must be same'})
        }
        else{
            const body = _.pick(req.body,["receipt"])
          
            if(req.file){
                body.receipt = req.file.path
            }
            Task.findByIdAndUpdate({_id:id},{"receipt":body.receipt},{new:true,runValidators:true})
            .then(taskform=>{
                res.send(taskform)
            })
            .catch(err=>{
                res.send(err)
            })

        }
    }   
})

router.put('/edit/grade/:id',authenticateUser,adminAccess,async(req,res)=>{
    const id=req.params.id
    const body=req.body
    Task.findByIdAndUpdate({_id:id},body,{new:true,runValidators:true})
    .then(taskform=>{
        res.send(taskform)
    })
    .catch(err=>{
        res.send(err)
    })
})

router.get('/view',authenticateUser,(req,res)=>{
    const user=req.user
    Task.find().populate('assignedTo','username').populate('createdBy','username')
    .then(taskform=>{
        let filteredForm=[]
        for(let i=0;i<taskform.length;i++){
            if(taskform[i].createdBy._id.toString()===user._id.toString()||(user._id.toString()===taskform[i].assignedTo._id.toString()))
            {
                filteredForm.push(taskform[i])
            }
            
        }
        res.send(filteredForm)
    })
        
    .catch(err=>{res.send(err)})

})
module.exports={
    taskformRouter:router
}