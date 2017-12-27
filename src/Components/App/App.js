import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {playlistName: "New Playlist",
    playlistTracks:[],
    searchResults:[]
    };
    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlayListName=this.updatePlayListName.bind(this);
    this.savePlaylist=this.savePlaylist.bind(this);
    this.search=this.search.bind(this);
  }

  addTrack(track){
    let tracks = this.state.playlistTracks;
    for(let i = 0; i < tracks.length; i++)
    {
      if(tracks[i].id === track.id)
      {
        return
      }
    }
    tracks.push(track)
    this.setState({playlistTracks: tracks})
  }

  removeTrack(track){
    let tracks = this.state.playlistTracks
    let newTracks = tracks.filter(trackitem => trackitem.id !== track.id)
    this.setState({playlistTracks: newTracks})
  }

  updatePlayListName(name){
    this.setState({playListName: name})
  }

  savePlaylist(){
    Spotify.savePlaylist(this.state.playListName, this.state.playlistTracks.map(track=> track.uri))
    this.updatePlayListName("New Playlist")
    this.setState({playlistTracks: []})
  }

  search(searchTerm){
    Spotify.search(searchTerm).then(tracks=>
      this.setState({searchResults: tracks}))
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.playlistName} onNameChange={this.updatePlayListName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
