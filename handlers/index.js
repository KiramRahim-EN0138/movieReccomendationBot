//var fetch = require('node-fetch')
//import fetch from 'node-fetch'
//import on lambda is asynch -wierd
//const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

getAnyMovie("Comedy");

var url;
const api_key = '95e92f092410da08aba2f6f2d4c25ba1';
exports.handler = async (event) => {

    var cast_in = event.currentIntent.slots.cast;
    var genre_in = event.currentIntent.slots.genres;
    var release_year = event.currentIntent.slots.release_year;
    var movies;
    
    if(cast_in == "any" && release_year == "any"){
        movie = await getAnyMovie(genre_in);
    }
    
//     else if(cast_in == "any" && release_year != "any"){
//         console.log(release_year);
//         movies = await getMovieGenreYear(genre_in, release_year)
//     }
    
//     else{
//          movies = await getMovie(cast_in, genre_in, release_year);
//     }
//     //movies = await getMovie(cast_in, genre_in, release_year);
//     const message = movie;

//     const response = {
//         dialogAction:
//                 {
//                     fulfillmentState: "Fulfilled",
//                     type: "Close", "message":
//                     {
//                         "contentType": "PlainText",
//                         "content": message
//                     }
//                 }
//     }

//     console.log(response);
//     return response;
}


//function to get movie with a user specified cast, genre, release year
async function getMovie(cast_in, genre_in, release_year){
    let cast_id = await getCast(cast_in);
    let genre_id = await getGenre(genre_in);
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&primary_release_year=${release_year}
    &language=en&sort_by=popularity.desc&with_genres=${genre_id}&with_cast=${cast_id}`

    const resp = await fetch(url);
    const movies = await resp.json();
    console.log(movies.results[0]);

    return movies;
}

//get movie by genre - any cast or year - not working correctly
async function getAnyMovie(genre_in){
    
    console.log(genre_in)
    let genre_id = await getGenre(genre_in);
    console.log(genre_id);
    url = ` https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&with_original_language=en&sort_by=popularity.desc&with_genres=${genre_id}`
    
    const resp = await fetch(url);
    const movies = await resp.json();
    let n = movies.results.length;
    console.log(n);
    
    let r = movieRandomiser(0, n);
    //return random result
    console.log(movies.results[r])
    return movies.results[r];
}

function movieRandomiser(min, max) {
    return Math.floor(Math.random() * max)
  }
  

//get movie by genre and year specified by user, any cast
async function getMovieGenreYear(genre_in, release_year){
    let genre_id = await getGenre(genre_in);
    console.log(genre_id);
    
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&=primary_release_year=${release_year}&with_genres=${genre_id}`
    const resp = await fetch(url);
    const movies = await resp.json();
    
    return movies;
}

//function to retrieve cast_id for cast query
async function getCast(cast_in){
    console.log(cast_in);
    url = `http://api.tmdb.org/3/search/person?api_key=${api_key}&query=${cast_in}`
    const resp = await fetch(url).then() ;
    var person = await resp.json();
    var id = person.results[0].id

    return id;
}

//function retrieve genre_id for genre query
async function getGenre(genre_in){
    url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-US`
    const resp = await fetch(url).then() ;
    var data = await resp.json();
    console.log(data.genres);
    var id;

    for(var g of data.genres){
        if(genre_in === g.name){
            console.log(g)
            id = g.id
        }
    }
    
    return id;
}



//test area
test = getAnyMovie("Comedy");
console.log("test");
