require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spot;
const nodeArgs = process.argv; //gives a list of all commands typed and returns commands in an array
const action = nodeArgs[2];
var query = nodeArgs.slice(3).join(" "); //slice takes anything starting from said number
const fs = require('fs');
var spotify = require('node-spotify-api');
var spotify = new spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});







function spotifyThisSong(songName) {

    if (songName == "") {
        songName = "Ace of Base";
    }

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        Spot = data.tracks.items[0];
        console.log("Name of Artist: " + Spot.album.artists[0].name)
        console.log("Preview Link: " + Spot.external_urls.spotify)
        console.log("Album Name: " + Spot.album.name)
    });

};

if (action === 'spotify-this-song') {
    spotifyThisSong(query);
}
// if (action == "spotify-this-song") {

// }


function bandsintown(artist) {
    // this link will grab events about the artist that I will provide
    console.log(artist)
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    // here I am telling axios to search the url and print the results in my console log
    axios(queryUrl) //1. axios is retirving events using the artist that the user provided
        .then(function (results) { //2. once it gets the info from the API it saves the results from the variable
            // console.log(results.data[0]) //3. once i get the results it will log them in console
            
            console.log("Name of Venue: " + results.data[0].venue.name)

            console.log("Date: " + moment(results.data[0].datetime).format("MM/DD/YYYY"))

            console.log("Location: " + results.data[0].venue.city + ", " + results.data[0].venue.country)
            console.log("\n");

        })
        .catch(function (error) { //4. if axios does not work, the error will be caught.
            console.log(error)
        })
}


if (action == "concert-this") {
    bandsintown(query)
}


function movie(lookthis) {
    if (!lookthis) {
        lookthis = "Mr Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + lookthis + "&y=&plot=short&apikey=94498414";

    axios.get(queryUrl).then(
        function (response) {
            // console.log(response.data);
            console.log("\nTitle: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating + " | Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("\n");
        }).catch(function (error) {
            console.log("Oops! Something went wrong \n" + error);
            return;

        })
};
if (action == "movie-this") {
    movie(query)
} 

// this function will take the text from my random txt file and call LIRI's command

function randomTx () {

var array = fs.readFileSync('random.txt').toString().split("\n");
for(i in array) {
    
    var liriCommand = array[i].split(",",2);

    var SecondString = "'" + liriCommand[1] + "'";
    var RmoveChar = SecondString.substr(2).slice(0,-2);

     switch(liriCommand[0]) {
    
        case "spotify-this-song":
        spotifyThisSong(RmoveChar);
        break;

        case "concert-this":
        bandsintown(RmoveChar);
        break;

        case "movie-this":
        movie(RmoveChar);
        break;
    
        
        
    }
}
};

if (action == "do-what-it-says") {
    randomTx()
} 