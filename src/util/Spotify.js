const clientID = '72648e17a91c437186c8e5af3f468b01'
const redirect_uri = 'https://cluojamming.surge.sh/'
let accessToken = ''
let expiresIn = ''

const Spotify = {
	getAccessToken(){
		if (accessToken !==''){
			return accessToken
		}

		if (window.location.href.indexOf('access_token') === -1){
			window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`
			return
		}

		accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
		expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];

		window.setTimeout(() => accessToken = '', expiresIn * 1000);
		window.history.pushState('Access Token', null, '/');
      	return accessToken
	},

	search(term){
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
		{
		  	headers: {
		  		Authorization: `Bearer ${this.getAccessToken()}`
			}
		}).then(response => {
			return response.json();
		}).then(jsonResponse =>{
				if (!jsonResponse.tracks){
					return [];
				}else{
					return jsonResponse.tracks.items.map(track=> 
						({
							id: track.id,
							name: track.name,
							artist: track.artists[0].name,
							album: track.album.name,
							uri: track.uri
						})
					);
				}
			}
		)
	},

	savePlaylist(playlistName, trackURIs){
		console.log(playlistName)
		console.log(trackURIs)
		if (playlistName === '' || trackURIs.length === 0)
		{
			return
		}
		let headers = {
			Authorization: `Bearer ${accessToken}`
		}
		let userID
		let playlistID

		fetch(`https://api.spotify.com/v1/me`, 
			{
				headers: headers
			}).then(response => {
				return response.json();
			}).then(jsonResponse => {
				userID = jsonResponse.id
				fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`

						},
						method: 'post',
						body: JSON.stringify({name: playlistName})
					}).then(response => {
						return response.json();
					}).then(jsonResponse => {
						console.log(jsonResponse)
						playlistID = jsonResponse.id
						fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
						{
							headers: {
								Authorization: `Bearer ${accessToken}`
							},
							method: 'POST',
							body: JSON.stringify({uris: trackURIs})
						})
					})
			})
	}
}

export default Spotify