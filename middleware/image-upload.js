const multer = require("multer");
const path = require("path");
const os = require("os")

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    cb(null, path.join(os.tmpdir()));
  },
  filename: (req, file, cb) => {
    const dateStamp = Date.now();
    cb(
      null,
      file.fieldname + "" + dateStamp + path.extname(file.originalname)
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 30000000, // 30000000 Bytes = 30 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|gif|webm)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload the valid image file"));
    }
    cb(null, true);
  },
});

module.exports = imageUpload;