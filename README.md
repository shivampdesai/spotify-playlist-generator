# spotify-playlist-genrator

This playlist generator is a simple react app that leverages the Spotify Web API to create a playlist that contains tracks that 2 users have in common. This guide assumes that Node.js (https://nodejs.org/en/download/) is installed on your machine. To get started:

Setting up the App:

1) Clone the repository to your machine using: ```git clone https://github.com/shivampdesai/spotify-playlist-generator.git```
2) Navigate into the auth directory: ```cd spotify-playlist-generator/auth-server```
3) Install dependencies: ```npm install```
4) Run the Auth server: ```node authorization_code/app.js```
5) Open a new shell tab
6) Navigate to the client directory: ```cd ../client```
7) Install dependencies: ```npm install```
8) Run the server: ```npm start```

Using the app:

1) If a new tab on the browser does not automatically open, navigate to ```http://localhost:3000```
2) Click "Login to get started" and log in using your Spotify credentials.
3) Enter your friend's URI, and click "add friend".
4) Click "Create playlist".
5) Your spotify app would have updated and will contain the created playlist. 
