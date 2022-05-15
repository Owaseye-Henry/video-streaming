const express = require("express");
const app = express()
const  ejs = require('ejs')
app.set('view engine' ,'ejs')
app.use(express.static('public'))
const fs = require('fs')


app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/video', (req,res)=>{
    const range = req.headers.range;
    if(!range)
    {
        res.status.apply(400).send('Requires range header ')
    }
    const videoPath = 'public/movie/video.mp4'
    const videoSize = fs.statSync(videoPath).size
    const chunk = 10 ** 6
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + chunk, videoSize - 1)
    
    const contentLength = end - start + 1;
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206,headers)

    const videoStream = fs.createReadStream(videoPath,{start,end})
    videoStream.pipe(res)
})
app.listen(3000,()=>{console.log(`server is listening on port 3000`)})