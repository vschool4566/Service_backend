const express = require("express");
const mongoose = require("mongoose");
const SignUp = require('./models.js');
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())
mongoose.connect("mongodb+srv://service:service@cluster0.dpvyejs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Db connected...."))
.catch(err => console.error("Db connection error:", err));

app.get('/hello', (req, res) => {
    res.send("Hellosss");
});

app.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, email, phoneNumber, password } = req.body;
        
        if (!firstname || !lastname || !email || !phoneNumber || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newUser = new SignUp({
            firstname,
            lastname,
            email,
            phoneNumber,
            password
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(8000, () => {
    console.log("Running.....");
});
