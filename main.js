(function () {
  var stateKey = 'spotify_auth_state';
  var currPlaylist = '';

  /**
   * Obtains parameters from the hash of the URL
    * @return Object
    */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);

    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }

    return hashParams; 
  };

  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */
  function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById('user-profile');

  var userPlaylistsSource = document.getElementById('user-playlists-template').innerHTML,
    userPlaylistsTemplate = Handlebars.compile(userPlaylistsSource),
    userPlaylistsPlaceholder = document.getElementById('user-playlists');

  var params = getHashParams();

  var access_token = params.access_token,
    state = params.state,
    storedState = localStorage.getItem(stateKey);

  if (access_token && (state == null /*|| state !== storedState*/)) {
    //alert('There was an error during the authentication');
  } else {
    //localStorage.removeItem(stateKey);
    if (access_token) {
        //Gets the user's profile information
      $.ajax({
        url: 'https://api.spotify.com/v1/me/',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
          userProfilePlaceholder.innerHTML = userProfileTemplate(response);

          $('#login').hide();
          $('#loggedin').show();
        }
      });

      var playlistURIs = {};
      var currTracks = [];

      //Gets the user's first 10 playlists
      $.ajax({
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
          userPlaylistsPlaceholder.innerHTML = userPlaylistsTemplate(response);
          
          for (var p of response.items) {
            playlistURIs[p.id] = p.uri;
          }
        },
        data: {limit: 10}
      });
    } else {
      $('#login').show();
      $('#loggedin').hide();
    }
   
    var avgTempo = 0;

    //Displays corresponding playlist when user clicks on a playlist
    $('.playlists').click(function () {
      currPlaylist = this.id;
      var userID = $('.user').attr('id');
      avgTempo = 0;

      $('#currPlaylist').html('<iframe src="https://embed.spotify.com/?uri=' + 
        playlistURIs[currPlaylist] + 
        '" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>');

      //Gets the current playlist
      $.ajax({
        url: 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + currPlaylist + '/tracks',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
          currTracks = [];
          for (var i of response.items) {
            currTracks.push(i.track.id);
          }

          var numTracks = currTracks.length;
          if (numTracks > 5) {
            numTracks = 5;
          }
          for (i = 0; i < numTracks; i++) {
            
            //Gets the audio features for each track in the current playlist
            $.ajax({
              url: 'https://api.spotify.com/v1/audio-features/' + currTracks[i] ,
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function (response) {
                var t = Math.round(response.tempo / numTracks * 100) / 100;
                addTempo(t);
              }
            });

          }
        }
      });
    });

    /**
     * Adds to the average tempo
     */
    var addTempo = function addTempo(t) {
      avgTempo += t;
      setSpeed(avgTempo);
    };

    /**
    * Updates the speed
    */
    var setSpeed = function setSpeed(speed) {
      window.speed = (speed - 100) * 0.015;
      $('#tempo').html('<div >average tempo: ' + Math.round(speed * 100) / 100 + '</div>');
    };

    //Authenticates user when they log in
    $('#login-button').click(function () {
      var client_id = '95c78bfaf97f4712bdff75b8ad883573'; 
      var redirect_uri = 'http://sknop8.github.io/Music-xx/';// 'http://localhost:8080';

      var state = generateRandomString(16);

      localStorage.setItem(stateKey, state);
      var scope = 'playlist-read-private streaming';

      var url = 'https://accounts.spotify.com/authorize';
      url += '?response_type=token';
      url += '&client_id=' + encodeURIComponent(client_id);
      url += '&scope=' + encodeURIComponent(scope);
      url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
      url += '&state=' + encodeURIComponent(state);
      url += '&show_dialog=' + true;

      window.location = url;
    });

    //Redirects to login page
    $('#relogin').click(function () {
      $('#login-button').trigger('click');
    });

  }

})();
