import {upload} from '/upload.js' // Why {}?

upload('#file', {
    multi:true,
    accept:['.jpg', '.jpeg', '.png', '.gif'],
    onUpload(files){
        console.log('Files: ', files)
    }
})
