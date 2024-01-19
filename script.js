const express = require("express"); //lib in nodejs to simplyfy the app cuilding process
const mongoose = require("mongoose"); //to use mongoDB
const bodyParser = require("body-parser"); //to make the client-side data readable
const dotenv = require("dotenv"); //to hide passwords

const app = express (); //instance of express
dotenv.config();

const port = process.env.PORT || 8080;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect('mongodb+srv://'+username+':'+password+'@cluster0.fr4ar5d.mongodb.net/registrationFormDB', {
    useNewUrlParser : true, //for warnings
    useUnifiedTopology : true,
});

const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

// Module using the Schema we made above
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded ({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/html&css/signup.html")
})

// For sign-up
app.post("/register", async (req, res) => {
    try{
        const {name, email, password, conpass} = req.body;
        
        if(password === conpass){
            const existingUser = await Registration.findOne({email: email});
        //check for existing user
        if(!existingUser){
            const registrationData = new Registration({
                name,
                email,
                password
            })
            await registrationData.save();
            res.redirect("/success");
        }
        else{
            console.log("User already Exists.");
            res.redirect("/error");
        }
        }

        else{
            console.log("Password and Confrim password shouldn't be different.");
            res.redirect("/error");
        }
        
    }
    catch (error){
        console.log(error);
        res.redirect("/error");
    }
})

// For sign-in
app.post("/checkin", async (req,res) => {
    try{
        const {name, email, password} = req.body;
        const existingUser = await Registration.findOne({email: email});
        if(!existingUser){
            console.log("User doesn't Exist.");
            res.redirect("/error");
        }
        else{
            res.redirect("/success");
        }
    }
    catch (error){
        console.log(error);
        res.redirect("/error");
    }
})

app.get("/success", (req, res) =>{
    res.sendFile(__dirname + "/html&css/success.html");
})

app.get("/error", (req, res) =>{
    res.sendFile(__dirname + "/html&css/error.html");
})

app.get("/signup", (req, res) =>{
    res.sendFile(__dirname + "/html&css/signup.html");
})

app.get("/signin", (req, res) =>{
    res.sendFile(__dirname + "/html&css/signin.html");
})

app.listen(port, ()=>{
    console.log('server is running the port successfully on port '+ port);
})