const fs = require('fs');
const ytdl = require('ytdl-core');
const argv = require('minimist')(process.argv.slice(2))
let ffmpeg = require('fluent-ffmpeg');
/**
 *  Example input
 *  $ node index.js list.txt -l -a = Download to audio files from the list
 * 
 *  
 *  -a = Audio download
 *  -v = Video download
 *  -d = Debug mode (Adds extra console output to view what the Code is doing)
 *  -l = List Download (If you have a list of URLs to download)
 *  -f = Download Audio without FFMPEG (Only available in conjunction with -a and will create massive mp3 files)
 * 
 * 
 * 
 *  Combined Flag output examples:
 *  -a & -l = Take the list and download audio
 *  -v & -l = Take the list and download video
 *  -a = Audio only from Argument
 *  -v = Video only from Argument
 * 
 *  Planned:
 *   AutoGet and Set File's metadata
 *   Auto Grab URL's from Playlist - add flag to auto download
 *   
 */


let videoDir = './videos'  //Variable with the folder name to store videos
if(!fs.existsSync(videoDir)){ //Check if the Video folder already exists
    fs.mkdirSync(videoDir)}; // If not make it

let audioDir = './audio' //Variable with the folder name to store audio
if(!fs.existsSync(audioDir)){ //Check if the Audio folder already exists
    fs.mkdirSync(audioDir)} //If not make it


if(!argv['a'] && !argv['v']){ //If no Format flag is found execute
    console.log('Please include a Format flag! (-a for audio and -v for video)') // Output if the user forgot to add a format flag
}

let vidTitle = "";
if(argv['a'] && !argv['l']){//Audio only
    
    let URL = "https://www.youtube.com/watch?v=" + argv['_']; //The Input from Command line becomes the URL
    ytdl.getInfo(URL ,function(err, info) {
        vidTitle = info.title;
        let escTitle = vidTitle.replace(/([/,(, ,)])+/g,"")
       if(argv['f']){
           ffmpeg = require("./")
        ytdl.getInfo(URL ,function(err, info) {
            let vidTitle = info.title;
            let escTitle = vidTitle.replace(/([/,(, ,)])+/g,"")
            ytdl(URL,{filter:'audioonly'}).pipe(fs.createWriteStream(`./${audioDir}/${(escTitle)}.mp3`)).on('end', function() {
                console.log(`Downloaded - ${vidTitle}`)
            })
            if (err) throw err;
        });
       }else{
        let stream = ytdl(URL);
        var proc = new ffmpeg({source: stream});
    
        proc.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");
        proc.withAudioCodec('libmp3lame')
            .toFormat('mp3')
            .output(`./${audioDir}/${escTitle}.mp3`)
            .run();
        proc.on('end', function() {
            console.log(`Downloaded - ${vidTitle}`);
        });
       }

        if (err) throw err;
    });
}


if(argv['v'] && !argv['l']){//Video only
    let URL = "https://www.youtube.com/watch?v=" + argv['_']; //The Input from Command line becomes the URL
    ytdl.getInfo(URL ,function(err, info) {
        let vidTitle = info.title;
        let escTitle = vidTitle.replace(/([/,(, ,)])+/g,"")
        ytdl(URL).pipe(fs.createWriteStream(`./${videoDir}/${(escTitle)}.mp4`)).on('finish', function() {
            console.log(`Downloaded - ${vidTitle}`)
        })
        if (err) throw err;
    });

}


if(argv['a'] && argv['l']){//Audio List
    let text;
    let list;

    let file = `./${argv['_']}` //Get the file name from the Process arguments 
    if(!fs.existsSync(file)){ // If it does not exists - execute below
        console.log('No list file found') // Output if no file is found
    }else{
        text = fs.readFileSync(file, "utf-8"); // Read File and set Variable
        list = text.split(','); // Set Variable as readable array
        if(argv['d']){ //Debugger Flag
            console.log(`${list.length} Videos loaded`) // Get how many were in the List Array
        }
        let i = 0;
        let x = 0;
        list.forEach(function(element){ //Function checking all are visible before executing
            if(argv['d']){//Debugger Flag
                console.log(`(${i+1}/${list.length}) Loaded | ${element}`) //Output for loading files
            } 
            let URL = "https://www.youtube.com/watch?v=" + element;
    
            ytdl.getInfo(URL ,function(err, info) {
                let vidTitle;
                
                vidTitle = info.title;
                let escTitle = vidTitle.replace(/([/,(, ,)])+/g,"") //Escapes Characters in Video title
                let stream = ytdl(URL); //Sets Stream source as 
                
                var proc = new ffmpeg({source: stream});
                
                //currently have ffmpeg stored directly on the server, and ffmpegLocation is the path to its location... perhaps not ideal, but what I'm currently settled on. And then sending output directly to response.
                //proc.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");
                proc.withAudioCodec('libmp3lame')
                    .toFormat('mp3')
                    .output(`./${audioDir}/${escTitle}.mp3`)
                    .run();
                proc.on('end', function() {
                    console.log(`(${x+1}/${list.length}) Downloaded | ${vidTitle}`);
                    x++
                });
                if (err) throw err;
            });
            i++ 
        });
    }
}


if(argv['v'] && argv['l']){//Video List
    let text;
    let list;

    let file = `./${argv['_']}` //Get the file name from the Process arguments 
    if(!fs.existsSync(file)){ // If it does not exists - execute below
        console.log('No list file found') // Output if no file is found
    }else{
        text = fs.readFileSync(file, "utf-8"); // Read File and set Variable
        list = text.split(','); // Set Variable as readable array
        if(argv['d']){ //Debugger Flag
            console.log(`${list.length} Videos loaded`) // Get how many were in the List Array
        }
        let i = 0;
        let x = 0;
        list.forEach(function(element){ //Function checking all are visible before executing
            if(argv['d']){//Debugger Flag
                console.log(`(${i+1}/${list.length}) Loaded | ${element}`) //Output for loading files
            } 
            let URL = "https://www.youtube.com/watch?v=" + element;
    
            ytdl.getInfo(URL ,function(err, info) {
                let vidTitle;
                vidTitle = info.title;
                let escTitle = vidTitle.replace(/([/,(, ,)])+/g,"") //Escapes Characters in Video title
                ytdl(URL).pipe(fs.createWriteStream(`./${videoDir}/${escTitle}.mp4`)).on('finish', function(){
                    console.log(`(${x+1}/${list.length}) Downloaded | ${vidTitle}`)
                    x++
                })
                if (err) throw err;
            });
            i++
        });
    }  
}