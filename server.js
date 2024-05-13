if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// curl --request GET \
// --url "https://api.github.com/aythen-login" \
// --header "Authorization: Bearer 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" \
// --header "X-GitHub-Api-Version: 2022-11-28"

// Importing libraries that we installed using npm
const express = require('express')
const app = express()
const bcrypt = require('bcrypt') 
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
// const router = require("express").Router();
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id))

 const users = []

 // Set Views
app.set('views', 'views')
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

// app.use(cors({
//     origin: "http://localhost:3000",
//     methods: "GET, POST, PUT, DELETE",
//     credentials: true,
// })
// );



app.get('/', checkAuthenticated, (req, res) => {
    // data={email:'test@test.com', adress:'noida', skills:['node js','php','java']}
    res.render('index', { name: req.user.name });
    // console.warn('req.params.name');
 })

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
      console.log(users)
})

 app.delete('/logout?', (req, res) => {
     req.logOut(req.user, err => {
         if (err) return next(err)
         res.redirect('/login')
         console.log('logged out')
    })

  })

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
}

// listen on port 3000
app.listen(3000)



