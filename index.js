
//import on lambda is asynch -wierd
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

var url;
const api_key = '95e92f092410da08aba2f6f2d4c25ba1';

exports.handler = async (event) => {

    var cast_in = castInCleaner(event.currentIntent.slots.cast);
    var genre_in = event.currentIntent.slots.genres;
    var release_year = event.currentIntent.slots.release_year;
    var movie;
    var message
    
    //cast specified !! release year specified
    if(cast_in == "any" && release_year == "any"){
        console.log("GET ANY MOVIE");
        movie = await getAnyMovie(genre_in);
        if(movie == undefined){
            message = `I'm sorry, I wasn't able to find any ${genre_in}'s to suit you, try again!`
        }

        else{
            message = `I'd have to reccomend ${movie.original_title}, its a belter!`;
        }
    }
    
    //cast specified !! release year not specified
    else if(cast_in == "any" && release_year != "any"){
        console.log(release_year);
        movie = await getMovieGenreYear(genre_in, release_year)
        if(movie == undefined){
            message = `I'm sorry, I wasn't able to find any ${genre_in}'s to suit you, try again!`
        }

        else{
            message = `I'd have to reccomend ${movie.original_title}, its a belter!`;
        }
    }
    
    //trinity specified
    else{
        movie = await getMovie(cast_in, genre_in, release_year)

        //check if a movie was found, return appropriate response - INTEGRATE WITH OTHER STATES
        if(movie == undefined){
            message = `I'm sorry, I wasn't able to find a ${genre_in} movie to suit you, try again!`
        }

        else{
            message = `I'd have to reccomend ${movie.original_title}, its a belter!`;
        }
    }

    //movies = await getMovie(cast_in, genre_in, release_year);
    console.log(message);

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



//function to get movie with a user specified cast, genre, release year
async function getMovie(cast_in, genre_in, release_year){
    let cast_id = await getCast(cast_in);
    let genre_in_cl = parseGenreIn(genre_in);
    let genre_id = await getGenre(genre_in_cl);

    url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&primary_release_year=${release_year}
    &language=en&sort_by=popularity.desc&with_genres=${genre_id}&with_cast=${cast_id}`

    const resp = await fetch(url);
    var movies = await resp.json();

    return movieRandomiser(movies.results);
}

async function getAnyMovie(genre_in){
    let genre_in_cl = parseGenreIn(genre_in);
    let genre_id = await getGenre(genre_in_cl);
   
    console.log(genre_id);
    url = ` https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&with_original_language=en&sort_by=popularity.desc&with_genres=${genre_id}`
    
    const resp = await fetch(url);
    var movies = await resp.json();
    
    return movieRandomiser(movies.results);
}

//get movie by genre and year specified by user, any cast
async function getMovieGenreYear(genre_in, release_yearIn){
    let genre_in_cl = parseGenreIn(genre_in);
    let genre_id = await getGenre(genre_in_cl);

    let release_year = release_yearIn;
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${genre_id}&primary_release_year=${release_year}`
    
    const resp = await fetch(url);
    let movies = await resp.json(); 
    
    //get random movie result
    return movieRandomiser(movies.results);
}

//function to retrieve cast_id for cast query
async function getCast(cast_in){
    console.log(cast_in);
    url = `http://api.tmdb.org/3/search/person?api_key=${api_key}&query=${cast_in}`
    const resp = await fetch(url).then() ;
    var person = await resp.json();
    console.log(person);
    if(person.results.length == 0){
        return 'any'
    }
    else{
        var id = person.results[0].id
        return id;
    }    
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

//helper methods - make bot ineraction 
function parseGenreIn(genre_in){
    let g = genre_in.toLowerCase();
    return g.charAt(0).toUpperCase() + g.slice(1);
}

function castInCleaner(cast_in){
    let c = cast_in.toLowerCase();
    console.log(c);
    var possibilies = {
        anys: [
            'maybe', 'possibly', 'any', 'anyone', null
        ],
        nos: [
            'nah', 'no', 'nope', 'ni', 'np', null,
        ]
    }

    //check if cast is anys - attempt to clean
    console.log(possibilies.anys)
    for(var p of possibilies.anys){
        if(p == c || parseInt(c)){
            return 'any'
        }
    }
    console.log(possibilies.nos)
    for(var p of possibilies.nos){
        if(p == c){
            return 'any'
        }
    }
    return c;
} 

function movieRandomiser(movies){
    console.log(movies);
    if(movies.length == 0){
        return undefined;
    }

    else{
        let n = movies.length;
        let r = randomInt(0, n);
        //return random result
        console.log(movies[r]);
        return movies[0];
    }
    
}

function randomInt(min, max) {
    return Math.floor(Math.random() * max)
  }
  



