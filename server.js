const fs= require("express")
const express = require("express")
const app =express()


app.get('api/v1/travels',(req,res)=>{

})

const port=3000
app.listen(port,()=>{
    console.log("the app is running on port " ,port)
})