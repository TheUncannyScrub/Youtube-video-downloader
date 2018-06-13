const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');
const argv = require('minimist')(process.argv.slice(2))


let URL = `https://www.youtube.com/watch?v=${argv['_']}`;
console.log(URL)
let vidTitle;
ytdl.getInfo(URL ,function(err, info) {
    vidTitle = info.title;
});


let videoDir = './videos'
if(!fs.existsSync(videoDir)){
    fs.mkdirSync(videoDir)};
let musicDir = './music'
if(!fs.existsSync(musicDir)){;
    fs.mkdirSync(musicDir)}

setTimeout(function mainApp() {
    if(!argv['v']){
        console.log(vidTitle)
        let escTitle = vidTitle.replace(/([/,(, ,)])+/g,"")
        ytdl(URL).pipe(fs.createWriteStream(`./${videoDir}/${(escTitle)}.mp4`)).on('finish', function() {
            try {
                var process = new ffmpeg(`./${videoDir}/${escTitle}.mp4`);
                    process.then(function (video) {
                    // Callback mode
                    console.log('Extracting audio to mp3 file.')
                    video.fnExtractSoundToMP3(`./${musicDir}/${escTitle}.mp3`, function (error, file) {
                    if (!error)
                        console.log('Audio file: ' + file);
                        console.log('Done - Completed without error')
                    });
                }, function (err) {
                    console.log('Error: ' + err);
                });
            } catch (e) {
                console.log(e.code);
                console.log(e.msg);
            }   
        });
    }else{
        console.log(vidTitle)
        let escTitle = vidTitle.replace(/([/,(, ,)])+/g,"")
        ytdl(URL).pipe(fs.createWriteStream(`./${videoDir}/${escTitle}.mp4`));
    }
},2000)
