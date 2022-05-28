// const multer = require('multer')
// const hbjs = require('handbrake-js')






function webmconverter(req, res, next){
    // try{
    //     const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, './uploads')
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, file.fieldname + '-' + Date.now() + '.webm')
    //         //cb(null, `${new Date()}-${file.originalname}`);
    //     }
    //     });

    //     const upload = multer({ storage });

    //     upload.single('file');

    //     next();
    // }
    // catch(ex){
    //     console.log("🔥",ex);
    //     next();
    // }
    
    // try{
    //     hbjs.spawn({ input: `./${req.file.path}`, output: 'something.m4v' })
    //     .on('error', err => {
    //         res.send({'success':false, 'message':'Filed to upload recording, please try again.'})
    //     })
    //     .on('end', () => {
    //         res.send({'success':true, 'message':'Request Completed, Thank you'})
    //     })
    //     next()
    // }
    // catch (ex) {
    //     // req.error = { 'status': 400, 'message': 'Invalid token.' }
    //     // next()
    //     res.status(400).send('Invalid token.')
    // }
}

module.exports = webmconverter;