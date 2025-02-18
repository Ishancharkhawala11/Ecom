const mongoose=require('mongoose')
const FeatureSchema=new mongoose.Schema({
    image:{
        type:String,
        unique:true

    }
},{timestamps:true})
module.exports=mongoose.model('Feature',FeatureSchema)