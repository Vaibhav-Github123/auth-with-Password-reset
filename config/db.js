const mongoose = require("mongoose")
const DBURL = process.env.DB_URL

mongoose.connect(DBURL).then(()=>{
    console.log("DB Connected Successfully Done..");
}).catch((error)=>{
    console.log(error);
})