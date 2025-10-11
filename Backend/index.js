import express from "express";
import dotenv from "dotenv"
import { connectDb } from "./config/db.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";

dotenv.config();
const app = express();

// cors 
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());

// cookie parser
app.use(cookieParser());

// flash messages
app.use(session({ secret: process.env.SECRET_KEY , resave: true , saveUninitialized: false }));
app.use(flash());

// app.use(verifyAuthentication);

app.use("/api/auth", authRouter);


app.get("/" , (req , res) => {
    res.send("Hello World! how");
});


const port = process.env.PORT || 3000; 
app.listen( port , () => {
    connectDb();
console.log(`server is running at : ${port}`);
});
