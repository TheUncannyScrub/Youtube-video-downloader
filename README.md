# Youtube video downloader
### A Youtube video dowloader in NodeJS.
#### With the ability to extract the audio using FFmpeg

---
**Basic Usage**:
The app defaults to converting it to an audio file. To Download *JUST* the video add a `-v` argument to the command line.

The app does not take a standard URL as a download link. Go to the search bar in your browser and copy the part of the URL **AFTER** :```https://www.youtube.com/watch?v=```
```javascript
node app.js dQw4w9WgXcQ -v
```
Just Video


```javascript
node app.js dQw4w9WgXcQ 
```
Video and Audio


The JavaScript file *app.js* checks if two folders exist if not it creates them when you first run the file: *./music* and *./video* . The music folder stores the audio file and the Video folder stores the mp4 file. 


This app was a 20 minute bodge because all the other version looked unsafe or dodgey. Feel free to use this even though its buggy and dont be afraid to mess on with it. Im working to make it a more inclusive app with the ability to download entire playlists at a time.
