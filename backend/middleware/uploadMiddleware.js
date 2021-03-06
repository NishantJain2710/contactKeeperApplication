import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    }
});

function checkFileType(file,cb){
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if(extname&& mimetype){
        return cb(null,true)
    }else{
        cb('Images only!')
    }
}

const upload = multer({
    storage: storage, 
    limits:{
        fileSize: 1024 * 1024 * 5  //5MB
    },
    fileFilter:function(req,file,cb){
        checkFileType(file,cb)
    }
});


export {upload};