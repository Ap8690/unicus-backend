const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const uuid = require("uuid").v4;

AWS.config.update({
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    region: process.env.S3_AWS_REGION,
});
AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
        console.log(
            `AWS S3 connected successfully with AWS region - ${AWS.config.region}`
        );
    }
});
const s3 = new AWS.S3();

const upload = multer({
    limits: {
        files: 1, // allow only 1 file per request
        fileSize: 10 * 1024 * 1024, // (10 MB Allowed only)
    },
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: "public-read",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            let extArray = file.mimetype.split("/");
            let extension = extArray[extArray.length - 1];
            var newFileName = Date.now() + "-" + uuid();
            var fullPath =
                process.env.S3_FOLDER_NAME +
                "/mint/nft/" +
                newFileName +
                "." +
                extension;
            cb(null, fullPath);
        },
    }),
});

function uploadImageToS3() {
    const cloudStorage = multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: "public-read",
        metadata: (req, file, cb) => {
            console.log("file.fieldname: ", file.fieldname);
            cb(null, { fieldName: file.fieldname });
        },
        // key: name of the file
        key: (req, file, cb) => {
          console.log("file: ", file);
            let extArray = file.mimetype.split("/");
            let extension = extArray[extArray.length - 1];
            const file_ =
                process.env.S3_FOLDER_NAME +
                `/${file.fieldname}/` +
                Date.now() +
                "-" +
                uuid() +
                "." +
                extension;
            cb(null, file_);
        },
    });
    const limitFileSize = { fileSize: 1024 * 1024 * 10 }, // 1Byte -->1024Bytes or 1MB --> 10MB
        filterFileType = (req, file, cb) => {
          console.log("filel: ", file);
            const isAllowedFileType =
                file.mimetype == "image/jpeg" ||
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/png" ||
                file.mimetype == "image/gif" ||
                file.mimetype == "video/webm" ||
                file.mimetype == "video/mp4" ||
                file.mimetype == "video/webp";

            if (isAllowedFileType) {
                console.log("isAllowedFileType: ", isAllowedFileType);
                cb(null, true);
                return;
            }
            // To reject this file pass `false`
            cb(null, false);
        };

    const upload = multer({
        storage: cloudStorage,
        limits: limitFileSize,
        fileFilter: filterFileType,
    });
    return upload;
}

const deleteImage = async (key) => {
    var params = { Bucket: process.env.S3_BUCKET_NAME, Key: key };

    return s3.deleteObject(params);
};

module.exports = { upload, uploadImageToS3, deleteImage };
