require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const MOVIES = require('./moviedex.json');
const cors = require('cors');

console.log(process.env.API_TOKEN);

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req,res,next){
    console.log.apply('validate bearer token middleware');
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;

    if(!authToken || authToken.split(' ')[1] != apiToken){
        return res.status(401).json({error:'Unauthorized request'})
    }
    next();
})

function handleGetMovies(req, res){
 const{genre, country, avg_vote} = req.query;
  let results = MOVIES;
 
  if(genre){
    results = results.filter(movie=>
        movie.genre.toLowerCase().includes(genre.toLowerCase()));}

  if(country){
     results = results.filter(movie=>
        movie.country.toLowerCase().includes(country.replace('%',' ').toLowerCase()));}

    if(avg_vote){
        results = results.filter(movie=>
            movie.avg_vote >= avg_vote);}

    res.json(results);
}

app.get('/movie',handleGetMovies);

const PORT = 8000;

app.listen(8000,()=>{
    console.log('Server is listening at http://localhost:8000')
})