require('dotenv').config();
const express = require('express');
require('./config/passport');
const passport = require('passport'); 
const session = require('express-session');
const cors = require('cors');
const authRouter = require('./routes/auth.route');
const connectDB = require('./config/db');
const app = express();

const userRouter = require('./routes/user.route');
const threadRouter = require('./routes/thread.route');

// CORS middleware - đặt trước tất cả middleware khác
app.use(cors({
    origin: '*',  // Cho phép tất cả origin trong môi trường development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Tạm thời đặt lại COOP để chẩn đoán
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    // Có thể cần cả CEEP nếu có vấn đề liên quan đến embed
    // res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); 
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRouter);
app.use('/user', userRouter);
app.use('/thread', threadRouter);


// Middleware xử lý lỗi
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running at port ${PORT}`)
});