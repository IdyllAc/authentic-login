if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Importing libraries that we installed using npm
const express = require('express')
const app = express()
const path = require('path');
const bcrypt = require('bcrypt') 
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id))

 const users = []

 // Set the views directory (optional if it's not the default '/views' directory)
 app.set('views', path.join(__dirname, '/views/index.ejs'));
 //  app.engine('ejs', ejs.renderFile);
 app.set('view engine', 'ejs')

 app.use(express.urlencoded({ extended: false }))
 app.use(flash())
 app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// app.get('/', checkAuthenticated, (req, res) => {
//     console.log(req.user);  // Check if req.user is defined
//     res.render('index', { name: req.user ? req.user.name : 'Guest' });  // Provide a fallback if req.user is undefined
// });



app.get('/', checkAuthenticated, (req, res) => {
    res.render('index', { name: req.user.name });
    res.render(__dirname + '/Users/stidyllac/Desktop/authentic-login/views/index.ejs') 
 });

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})


app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
     successRedirect: '/',
     failureRedirect: '/login', 
     failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    //  console.log(users)
})

 app.delete('/logout', (req, res) => {
     req.logOut()
     req.redirect('/login')

    })

    function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
  }

    function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
 }

// listen on port 3000
app.listen(3000)



