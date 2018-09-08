import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

var katha = '12127438563';
var biraj = '1215878791';
class App extends Component {


  constructor(){
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token? true : false,
      user: {
        name: '',
      },
      toptracks: [],
      playlists: []
    }
    const token = params.access_token
    if (token){
      spotifyApi.setAccessToken(token);
      this.getUserProfile();
      this.getTopTracks();
      this.getCurrentPlaylists();
    }

  }

  getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
  }

  getCurrentPlaylists(){
      spotifyApi.getUserPlaylists(biraj).then((data) => {
        this.setState({
          playlists: this.state.playlists.concat(data.items)
        });
      })
  }


  getTopTracks(){
    spotifyApi.getMyTopTracks().then((response) => {
      this.setState({
        toptracks: this.state.toptracks.concat(response.items)
      })
    })
  }


  getUserProfile(){
    spotifyApi.getUser(biraj).then((response) => {
      this.setState({
          user: {
            name: response.display_name
          }
      });
    })
  }

  render() {
    let plays = this.state.playlists
    return (
      <div className="App">
      <a href='http://localhost:8888'>
         <button>Login to get started</button>
      </a>

      <div> Name: { this.state.user.name } </div>

      <div>
        {plays.map(p => <h4> { p.name }: { p.tracks.total } songs </h4>)}
      </div>

      </div>
    );
  }
}

export default App;
