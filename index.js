const express = require('express')
const mysql = require("mysql")
const dotenv = require('dotenv')
const bcrypt = require("bcryptjs")
const session = require('express-session');

let app = express();
dotenv.config({ path: './.env'})

// other imports
const path = require("path")
const publicDir = path.join(__dirname, './public')
app.use(express.static(publicDir))
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())
app.use(session({
    secret : 'nunua42tfvgcvv.shjhdgyggyyd.alklssjh56sfftd',
    resave : true,
    saveUninitialized : true
}));

const db = mysql.createConnection({
    host:'localhost',
    user:'lawrence',
    password:'password',
    database:'logindb'
})

db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})
app.set('view engine', 'hbs')
//GET REQUESTS
app.get("/", (req, res) => {
    if(! req.session.loggedin){
        return res.render('index', {
            message: 'Please Log in'
        })
    }
    res.render("index")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/login", (req, res) => {
    if(req.session.loggedin){
        return res.render('index', {
            message: 'No need,you are already logged In!'
        })
    }
    res.render("login")
})
app.get("/logout",(req,res) =>{
    req.session.destroy()
    return res.render('index', {
        message: 'Successfully logged out'
    })
})
//POST REQUESTS
app.post("/auth/register", (req, res) => {    
    const { name, email, password, password_confirm } = req.body

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if(error){
            console.log(error)
        }

        if( result.length > 0 ) {
            return res.render('register', {
                message: 'This email is already in use'
            })
        }else if(password !== password_confirm) {
            return res.render('register', {
                message: 'Passwords no match'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8)

        //console.log(hashedPassword)
       
        db.query('INSERT INTO users SET?', {name: name, email: email, password: hashedPassword}, (err, result) => {
            if(error) {
                console.log(error)
            } else {
                req.session.loggedin = true
                return res.render('index', {
                    message: 'User registered!'
                })
            }
        })        
    })
})
app.post('/auth/login', (req,res) =>{
    const {email, password} = req.body

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
        if(error){
            console.log(error)
        }
        if(result.length > 0){
            let hashedPassword = await bcrypt.hash(password, 8)
            let passInDb = result[0].password
            bcrypt.compare(password, passInDb).then( (authorised) => {
                if(authorised){
                    //res.redirect('/')
                    req.session.loggedin = true;
				    req.session.username = email;
                    return res.render('index', {
                        message: 'Welcome,my friend'
                    })
                }
                else{
                    return res.render('login', {
                        message: 'Incorrect credentials'
                    })
                }
             });
        }
        else{
            return res.render('register', {
                message: `you don't exist in the system `
            })
        }
     })
})

//Finally
app.listen(process.env.PORT, ()=> {
    console.log(`server started on port ${process.env.PORT}`)
})
