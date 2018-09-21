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
        id: '',
        profileimage: ''
      },
        friend: {
          name: '',
          id: '',
          profileimage: ''
        },
        playlists: [],
        tracks: [],
        snapshot: '',
        commonTracks: [],
        playlistCreated: {
          state: '',
          image: '',
          name: ''
        },
        addfrienddisabled: false,
        createdisabled: false
    }

    const token = params.access_token
    if (token){
      spotifyApi.setAccessToken(token);
      this.getUserProfile();
      this.getuserplaylists();
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

  getuserplaylists(){
    spotifyApi.getUserPlaylists().then((response) => {
        this.setState({
          playlists: response.items
        })
        this.getTracks(response.items)
    })
  }

  getFriendandPlaylists(){
    var friendId = document.getElementById('friendId').value

    spotifyApi.getUser(friendId).then((response) => {
      this.setState({
        friend: {
          name: response.display_name,
          id: friendId,
          profileimage: response.images[0].url
        }
      })
    })

    spotifyApi.getUserPlaylists(friendId).then((response) => {
        this.setState({
          playlists: this.state.playlists.concat(response.items)
        })
        this.getTracks(response.items)
    })

    this.setState({
      addfrienddisabled: true
    })

  }

  getUserProfile(){
    spotifyApi.getMe().then((response) => {
      this.setState({
          user: {
            name: response.display_name,
            id: response.id,
            profileimage: response.images[0].url
          }
      });
    })
  }

  getTracks(playlists){

    for (var i = 0; i < playlists.length; i++){
      spotifyApi.getPlaylistTracks(playlists[i].id).then((response) => {
        this.setState({
          tracks: this.state.tracks.concat(response.items)
        })
      })
    }

  }

  getCommonTracks(){

    var tracks = this.state.tracks

    var common = []
    var hashTable = [];

    for (var i = 0; i < tracks.length; i++){

      if (hashTable[tracks[i].track.uri] === undefined) {
        hashTable[tracks[i].track.uri] = 1;
      } else {
        common.push(tracks[i])
      }
    }

    this.setState({
      commonTracks: common
    })

    this.createPlaylist()

  }

  createPlaylist(){

    var playistName = this.state.user.name + " and " + this.state.friend.name + "'s Custom Playlist";
    var descrip = "Custom playlist of " + this.state.user.name + " and " + this.state.friend.name + "'s liked songs generated with playlist generator by Shivam Desai";
    var data = {
      "name": playistName,
      "description": descrip,
      "public": false
  }

   spotifyApi.createPlaylist(this.state.user.id, data).then((response) => {
      this.addTrackstoPlaylist(response.id)
   })

  }

  addTrackstoPlaylist(id){

    var tracks = this.state.commonTracks;
    var tracksUris = [];
    var length = tracks.length
    if (length > 100) length = 100;

    for (var i = 0; i < length; i++){
      tracksUris.push(tracks[i].track.uri)
    }

    spotifyApi.addTracksToPlaylist(id, tracksUris).then((response) => {
      this.setState({
        snapshot: response.snapshot_id
      })
    })

    spotifyApi.getPlaylist(id).then((response) => {
      this.setState({
        playlistCreated : {
          state: "Playlist created!",
          name: "Look for: " + response.name
        }
      })
    })

    this.setState({
      createdisabled: true
    })
   }


  render() {

    let playlists = this.state.playlists
    return (
      <div className="App">
      <a href='http://localhost:8888'>
         <button>Login to get started</button>
      </a>

      <div> Name: { this.state.user.name } </div>

      <img src={this.state.user.profileimage} />

      <div> Friend: {this.state.friend.name } </div>

      <img src={this.state.friend.profileimage} />


      <h4> Enter friend ID </h4>
      <input type="text" name="Friend" id="friendId"/>


      <div>
        <button disabled={this.state.addfrienddisabled} onClick={() => this.getFriendandPlaylists()}>Add friend</button>
      </div>

      <div>
        <button disabled={this.state.createdisabled} onClick={() => this.getCommonTracks()}>Create Playlist</button>
      </div>

      <div> <h1>{this.state.playlistCreated.state}</h1> </div>
      <div> <h1> {this.state.playlistCreated.name} </h1></div>
      <div>
        <h3> Choosing tracks from: </h3>
      </div>
      <div>
        {playlists.map(p => <div> <h3> {p.name} </h3> <img src={p.images[0].url}/> </div>)}
      </div>


      </div>
    );
  }
}

export default App;
