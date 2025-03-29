require('dotenv').config();
const express = require('express');
require('./config/passport');
const passport = require('passport'); 
const session = require('express-session');
const authRouter = require('./routes/auth.route');
const connectDB = require('./config/db');
const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', authRouter);


app.get('/profile', (req, res) => {
    if (!req.user) return res.redirect('/');
    res.send(`
        <h1>Welcome ${req.user.displayName}</h1>
        ${req.user.photos?.[0]?.value ? `<img src="${req.user.photos[0].value}" width="100"/>` : ''}
        <p>Email: ${req.user.email || 'No email'}</p>
        <a href="/logout">Logout</a>
    `);
});

app.get('/', (req, res) => {
    res.send(`
        <h1>Login Demo</h1>
        <a href="/auth/google">Login with Google</a><br/>
        <a href="/auth/facebook">Login with Facebook</a>
    `);
});

app.listen(3000, () => {
    connectDB();
    console.log(`Server is running at port 3000`)
});