// import 
const { request } = require('express')
const express = require('express')
const app = express()
const port = 3000 




// static files 
app.use(express.static('public'))
app.use('/Css', express.static(__dirname + 'public/Css'))
app.use('/js', express.static(__dirname + 'public/js'))


// set views 
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res)=>{
    res.render('index')
})

app.get('/game', (req, res)=>{
    res.render('game')
})

app.get('/end', (req, res) => {
    res.render('end')
})

app.get('/highscores', (req, res)=>{
    res.render('highscores')
})


// Listen on port 3000 
app.listen(port, function(error){
    if(error) {
        console.log('something went wrong ', error)
    } else {
        console.log('Server is listening on port ' +port) 
    }
})