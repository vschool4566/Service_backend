const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SignUp = require('./models.js');

const app = express();

// Middleware
app.use(express.json());  // To parse JSON bodies
app.use(cors());          // To handle CORS

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://service:service@cluster0.dpvyejs.mongodb.net/<database>?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("DB connected...."))
.catch(err => console.error("DB connection error:", err));

// Routes
app.get('/hello', (req, res) => {
    res.send("Hello World");
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

// Start server
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
