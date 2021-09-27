const express = require('express');
const connectToMongo=require('./db.js');
connectToMongo();
const port=5000;
const app=express();
app.use(express.json())
app.get('/',(req,res)=>{
    res.send(`hello i am from port no, ${port}`)
})
//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))


app.listen(port,()=>{
    console.log(`listening to port no ${port}`);
})