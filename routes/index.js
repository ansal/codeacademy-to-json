var request = require('request');
var cheerio = require('cheerio');

exports.index = function(req, res){

  var username = req.params.username;
  var requestObject = {
    uri: 'http://www.codeacademy.com/' + username,
    method: 'GET',
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10  
  };

  function fetchUserInfo(error, response, html) {
    function fetchAchievements (error, response, html) {

      var $ = cheerio.load(html);
        
      // get achievement badges
      var userAchievements = $('.achievement');
      var achievements = [];
      for(var i = 0; i < userAchievements.length; i++) {
        achievements.push({
          name: $(userAchievements[i]).find('.name').text(),
          image: 'http://www.codeacademy.com' + $(userAchievements[i]).find('.badge').css('background-image').slice(4, -1)
        });
      }
      json.achievements = achievements;

      res.json(json);
    }
    if(error) {
      res.send({
        error: true,
        message: 'Sorry guys, I cannot convert for JSON for that username'
      });
      return;
    }
    var $ = cheerio.load(html);
    
    // get the full name and location
    var json = {
      name: $('.full-name').text(),
      location: $('.location-content').text()
    };

    // get point
    var points = $('.stat-count');
    json.points = $(points[0]).text();

    // get tracks
    var userTracks = $('.track-progress');
    var tracks = [];
    for(var i = 0; i < userTracks.length; i++) {
      tracks.push({
       title: $(userTracks[i]).find('.track-name').text(),
      });
    }
    json.tracks = tracks;

    var requestObject = {
      uri: 'http://www.codecademy.com/users/' + username + '/achievements',
      method: 'GET',
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10  
    };

    request(requestObject, fetchAchievements.bind({json: this.json}));
  }

  request(requestObject, fetchUserInfo);
};