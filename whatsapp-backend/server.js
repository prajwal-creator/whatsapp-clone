//importing
import express from "express";
import mongoose from 'mongoose';
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";

//app config
const app= express()
const port=process.env.port || 9000;


const pusher = new Pusher({
    appId: "1110387",
    key: "b695725dfb6e5b9ca048",
    secret: "83a0bcfbd52223df8cc1",
    cluster: "eu",
    useTLS: true
  });

//middleware
app.use(express.json());
app.use(cors());


//db config
const connection_url = 'mongodb+srv://prajwal:RhdrcAh6D1JXr6s0@cluster0.c8m1p.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

  
//ljlk
const db = mongoose.connection
db.once('open',()=>{
    console.log("DB connected");
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on('change',(change)=>{
        console.log(change);

        if(change.operationType === "insert"){
            const messageDetails = change.fullDocument;
            pusher.trigger("messages","inserted",{
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp:messageDetails.timestamp,
                received: messageDetails.received,
            });
        }else{
            console.log("Error triggering pusher")
        }

    });

});

//api routes
app.get('/',(req,res)=>res.status(200).send("hello world"));
app.get('/messages/sync',(req,res)=>{
    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err);
        } else{
            res.status(200).send(data);
        }
    });
});   
        
app.post('/messages/new',(req,res)=>{
    const dbMessage=req.body;
    Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err);
        } else{
            res.status(201).send(data);
            
        }
    });
});

//listen
app.listen(port, () => console.log('listening on localhost:${port}'));
