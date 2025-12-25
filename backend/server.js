import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import reviewRouter from './routes/reviewRoute.js'


// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Middlewares
app.use(express.json())

const allowedOrigins = [
  "http://localhost:5173", // Cho phép chạy local Admin
  "http://localhost:5174", // Cho phép chạy local Frontend
  "https://e-commerce-website-six-lac.vercel.app", // THÊM LINK VERCEL FRONTEND CỦA BẠN
  "https://shop-admin.vercel.app"     // THÊM LINK VERCEL ADMIN CỦA BẠN
];

// app.use(cors())
app.use(cors({
    // Cho phép cả Admin (5173) và Frontend (5174) gọi API
    origin: allowedOrigins,
    credentials: true
}));

// Api endpoint
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/review', reviewRouter)

app.get('/', (req, res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT: '+ port))