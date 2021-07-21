import { useEffect } from "react";
import React from "react";
import "./App.css";
import Login from "./Login";
import { getTokenFromUrl } from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";
import Player from "./Player";
import { useDataLayerValue } from "./DataLayer";
const spotify = new SpotifyWebApi();
function App() {
	const [{ user, token }, dispatch] = useDataLayerValue();
	useEffect(() => {
		const hash = getTokenFromUrl();
		window.location.hash = "";
		const _token = hash.access_token;
		if (_token) {
			spotify.setAccessToken(_token);
			// setToken(_token);
			dispatch({
				type: "SET_TOKEN",
				token: _token,
			});

			spotify.getMe().then((user) => {
				dispatch({
					type: "SET_USER",
					user: user,
				});
			});
			spotify.getUserPlaylists().then((playlists) => {
				dispatch({
					type: "SET_PLAYLISTS",
					playlists: playlists,
				});
			});
			spotify.getPlaylist("37i9dQZEVXcK1jVNhv7SyZ").then((response) => {
				dispatch({
					type: "SET_DISCOVER_WEEKLY",
					discover_weekly: response,
				});
			});
			spotify.getMySavedAlbums({ limit: 50 }).then((savedAlbums) => {
				console.log("savedAlbums", savedAlbums);
				dispatch({
					type: "SET_SAVED_ALBUMS",
					savedAlbums,
				});
			});
		}
	}, [token, dispatch]);
	return (
		<div className="app">
			{!token && <Login />}
			{token && <Player spotify={spotify} />}
		</div>
	);
}

export default App;