const multer  = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const profilePictureStorage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (request, file, callback) {
        if (!request.user.id) {
            callback("No user session.", "");
        } else {
            uidSafe(8).then((uid) => {
                const userId = request.user.id;
                const extension = path.extname(file.originalname);

                callback(null, `user_${userId}_${uid}${extension}`);
            });
        }
    },
});

const uploader = multer({
    storage: profilePictureStorage,
    limits: {
        fileSize: 4097152,
    },
});

module.exports =  uploader;