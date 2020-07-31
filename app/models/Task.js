const mongoose =require('mongoose')
const Schema=mongoose.Schema

const taskSchema=new Schema({
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    assignedTo:{
        type:Schema.Types.ObjectId,  
        ref:'User',// check this also
        required:true
    },
    receipt: {
        type: String,
        default: 'null',
        required:true
        
    },
    rating:{
        type:Number,
        min:1,
        max:5
        // required:true
    }
})
const Task=mongoose.model('Task',taskSchema)
module.exports={Task}