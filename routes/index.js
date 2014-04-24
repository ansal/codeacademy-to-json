var request = require('request');
var cheerio = require('cheerio');

exports.index = function(req, res){

  var username = req.params.username;
  var requestObject = {
    uri: 'http://www.codeacademy.com/' + username,
    method: 'GET',
    timeout: 50000,
    followRedirect: true,
    maxRedirects: 10  
  };

  function fetchUserInfo(error, response, html) {
    function fetchAchievements (error, response, html) {

      var $ = cheerio.load(html);
        
      // get achievement badges
      var userAchievements = $('.margin-top--1');
      var achievements = [];
      for(var i = 0; i < userAchievements.length; i++) {
        achievements.push({
          name: $(userAchievements[i]).text()
        });
      }
      json.achievements = achievements;

      res.json(json);
    }
    if(error) {
      console.log(error);
      res.send({
        error: true,
        message: 'Sorry guys, I cannot convert for JSON for that username'
      });
      return;
    }
    var $ = cheerio.load(html);
    // get the full name and location
    var json = {
      name: $($('h3')[0]).text(),
      bio: $($('p')[2]).text(),
      location: $($('p')[1]).text()
    };

    // get point
    var points = $('.stat-count');
    json.points = $($('h3')[4]).html();

    // get tracks
    var userTracks = $('.text--ellipsis');
    var tracks = [];
    for(var i = 0; i < userTracks.length; i++) {
      tracks.push({
       title: $(userTracks[i]).text(),
      });
    }
    json.tracks = tracks;

    var requestObject = {
      uri: 'http://www.codecademy.com/users/' + username + '/achievements',
      method: 'GET',
      timeout: 50000,
      followRedirect: true,
      maxRedirects: 10  
    };

    request(requestObject, fetchAchievements.bind({json: this.json}));
  }

  request(requestObject, fetchUserInfo);
};