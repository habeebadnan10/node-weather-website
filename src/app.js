const path = require('path');
const express = require ('express');
const hbs = require('hbs');

const geocode= require('./utils/geocode.js');
const forecast = require('./utils/forecast.js')

let app = express();
let port = process.env.PORT || 3000
console.log(path.join(__dirname , '../public'))

// Define paths express config
let publicDirectory = path.join(__dirname , '../public');
let viewDirectory = path.join(__dirname , '../templates/views');
let partialsDirectory = path.join(__dirname , '../templates/partials');

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views' , viewDirectory)
hbs.registerPartials(partialsDirectory);

//setup static directory to serve
app.use(express.static(publicDirectory));

//res.render() is used to send dynamic values to the pages , like title injects index value in index.hbs page
app.get('', (req,res)=> {
    res.render('index',{
        'title' : 'INDEX',
        'name' : 'Habeeb Adnan'
    })
})


app.get('/about', (req,res) => {
    res.render('about', {
        'title' : 'About Me',
        'name' : 'Habeeb Adnan'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        'title' : 'Help',
        'name' : 'Habeeb Adnan'
    })
})

app.get('/bad', (req , res ) => {
    res.send({
        Error : "Error its a bad request"
    })
})

app.get('/weather' , (req , res ) => {
    if(!req.query.address){
          return res.send({
               error : 'Please provide a address'
           })
    }
    console.log(req.query);
   let address = req.query.address;
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }
            res.send({
                location,
                'forecast' : forecastData,
                address
            })
            console.log(location)
            console.log(forecastData)
        })
    })
})

app.get('/products' , (req , res ) => {
    if(!req.query.search){
       return res.send({
            error : 'no poduct searched'
        })
    }
    console.log(req.query);
    res.send({
        'title' : 'bat',
        'name' : 'kookabura'
    })
})


app.get('/help/*', (req,res) => {
    res.render('404',{
        'title' : '404',
        'name' : 'Habeeb Adnan',
        'text' : 'help article not found'  
    }) 
})

app.get('*', (req,res) => {
    res.render('404',{
        'title' : '404',
        'name' : 'Habeeb Adnan',
        'text' : 'Page Not Found'  
    }) 
})

app.listen(port,()=>{
    console.log("starting the server...")
});