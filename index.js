//var fetch = require('node-fetch')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

var url;
const api_key = '95e92f092410da08aba2f6f2d4c25ba1';
exports.handler = async (event) => {

    var cast_in = event.currentIntent.slots.cast;
    var genre_in = event.currentIntent.slots.genres;
    var release_year = event.currentIntent.slots.release_year;

    const movies = await getMovie(cast_in, genre_in, release_year);
    const message = movies.results[0].title

    const response = {
        dialogAction:
                {
                    fulfillmentState: "Fulfilled",
                    type: "Close", "message":
                    {
                        "contentType": "PlainText",
                        "content": message
                    }
                }
    }

    console.log(response);
    return response;
}

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

async function getCast(cast_in){
    console.log(cast_in);
    url = `http://api.tmdb.org/3/search/person?api_key=${api_key}&query=${cast_in}`
    const resp = await fetch(url).then() ;
    var person = await resp.json();
    var id = person.results[0].id

    return id;
}

async function getGenre(genre_in){
    url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-US`
    const resp = await fetch(url).then() ;
    var data = await resp.json();
    console.log(data.genres);
    var id;

    for(var g of data.genres){
        if(genre_in === g.name){
            console.log(g)
        }
    }
}

