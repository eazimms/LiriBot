require("dotenv").config();
var keys = require('./keys.js'); 
var Spotify = require('node-spotify-api'); 
var inquirer = require('inquirer'); 
var moment = require('moment')
var axios = require('axios'); 

// Functions to get this running, so we can call them later. 




 
// Inquirer to create an interactive menu. 
inquirer.prompt([
  {
    type: 'list', 
    name: 'options', 
    message: 'What would you like to do?', 
    choices: ['spotify this','movie this', 'concert this', 'do what it says!'],
  },
  {
    name: 'query',
    type: 'input', 
    message: 'what are we looking up?'
  },
])
// Testing the answers to make sure they're recording correctly.
.then(answers => {
  var search = answers.options; 
  switch(search){
    case 'spotify this':
      var song = answers.query; 

      if(!song){
        song = "The Sign Ace of Base"; 
      }

      var spotify = new Spotify(keys.spotify)

      spotify.search({
        type: 'track',
        query: song,
        limit: 5, 

      },
      function(error, data){
        if(error){
          return console.log('you goofed ' + error); 
        }
        // var test = JSON.stringify(data.tracks.items); 
        var songs = data.tracks.items[0]; 

      

        
        console.log('Artist: ' +songs.artists[0].name); 
        console.log('Song name: ' +songs.name); 
        console.log('Album name: ' + songs.album.name) 
        console.log('Preview URL: ' +songs.preview_url); 
        console.log('---------'); 
        
      }); 
      
      break; 
      // Movie lookup, working. 
    case 'movie this': 
    
    var movieTitle = answers.query; 

    if(!movieTitle){
      movieTitle = 'Mr.Nobody'
      console.log("If you haven't watched 'Mr. Nobody', then you should: <http://www.imdb.com/title/tt0485947/>");
      console.log("It's on Netflix!"); 
    }
    
    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
      function(response) {
        console.log('Title: ' + response.data.Title); 
        console.log("Release Year: " + response.data.Year);
        console.log('Rated: ' + response.data.Rated); 
        console.log('IMDB Score: ' + response.data.Ratings[0].Value);
        console.log('Rotten Tomatoes Score: ' +response.data.Ratings[1].Value); 
        console.log('Actors: ' + response.data.Actors);
        console.log('Country: ' + response.data.Country); 
        console.log('Language: ' + response.data.Language); 
        console.log('Plot: ' + response.data.Plot);   
      }); 

    
    
      break; 
      // Concert lookup, same deal concert. 
    case 'concert this': 

    var band = answers.query; 

    var queryUrl = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp"; 
    
    axios.get(queryUrl).then(
      function(response, error){

        if(error){
          console.log('goofed:' + error); 
        }
        // console.log(response.data); 
        var values = JSON.stringify(response.data); 
        var info = JSON.parse(values); 
        
        for (var i = 0; i < info.length; i++){
          console.log(info[i].venue.name); 
          console.log(info[i].venue.city +' ' + info[i].venue.region); 
          var eventTime = moment(info[i].datetime).format('MM/DD/YYYY'); 
          console.log(eventTime); 
          console.log('------------'); 
          
        }
      }
    )
    // console.log('concert working'); 
    // console.log(answers.query); 
    
      break; 

    case 'do what it says': 
    break; 
  }
}); 

