import React from 'react';
import './Tracklist.css';
import Track from '../Track/Track.js';

class Tracklist extends React.Component {
  render() {
  	let tracks = this.props.tracks ? this.props.tracks : [];
    return (
		<div className="Tracklist">
		{	
		tracks.map(track=> 
			<Track track={track} 
			key={track.id} 
			onAdd={this.props.onAdd} 
			isRemoval={this.props.isRemoval} 
			onRemove={this.props.onRemove}/>
			)
		}
		</div>
    );
  }
}

export default Tracklist;