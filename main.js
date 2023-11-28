const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const  nocache = require('nocache')

const app = express();

app.use(cookieParser());

app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true,
}));
app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('views'));


const checkAuthenticator = (req,res,next) => {
    if(req.session.user){
        next();
    }else{
        res.redirect('/'); 
    }
}
app.get('/',(req,res)=>{
   if(req.session.user){
    res.redirect('/home');
   }else{
    res.render('index');
   }  
});



app.get('/home',checkAuthenticator,(req,res)=>{
    if(req.session.user){
        res.render('home',{user:req.session.user})
    }else{
        res.render('index')
    }
})

app.post('/home', (req,res) => {
    const {username, password} = req.body;

    if(username === 'Ananthu' && password === '123'){
        req.session.user = username;
        res.cookie('username',username,{ maxAge:900000, httpOnly: true});
        res.redirect('/home');
    }else{
        res.send('Invalid userid or password');
    }
});



app.get("/logout",(req,res) => {
    
    req.session.destroy((error)=>{
        if(!error){
            res.clearCookie('username');
            res.redirect('/');
        }else{
            res.send("eror");
        }
    });
})

const PORT = 3000;
app.listen(PORT,()=>{console.log(`Server created`)});