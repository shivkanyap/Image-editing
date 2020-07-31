const express=require('express')
const router=express.Router()
const {User}=require('../models/User')
const { authenticateUser}=require('../middeleware/authentication')


router.post('/register',(req,res)=>{
    let body=req.body
   if(body.role=='Instructor')
    {
       body.level=''
    }
    if((body.role=='user')&&(body.level==undefined)){
        return res.send({error:'for a user, level is mandatory'})
    }
    let user =new User(body)
    user.save()
    .then(user=>res.send(user))
    .catch(err=>res.send(err))
})
router.post('/login',(req,res)=>{
    const body=req.body
    User.findByCredentials(body.email,body.password)
    .then((user)=>{
        return user.generateToken()
    })
    .then((token)=>{
        console.log(token,'in tt')
        res.send({token})
    })
    .catch((err)=>{
        res.send(err)
    })    
})

router.get('/account',(req,res)=>{
    const {user}=req
    res.send(user)
})

router.delete('/logout', authenticateUser,function(req,res){
    const {user,token}=req
    User.findByIdAndUpdate(user._id,{$pull:{tokens:{token:token}}})
    .then(function(user){
        res.send({notice:'successfully logout...'})
    })
    .catch(function(err){
        res.send(err)
    })
})




module.exports={
    usersRouter:router
}