const AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-northeast-2'
})

const multer = require('multer');
const multerS3 = require('multer-s3');

const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
  Bucket: BUCKET_NAME
});

let foo = require('./foo.js');

module.exports = {
  upload: multer({
    storage: multerS3({
      s3: s3bucket,
      bucket: BUCKET_NAME,
      acl: 'public-read-write',
      contentType: function (req, file, cb) {
        cb(null, file.mimetype);
      },
      metadata: function (req, file, cb) {
        cb(null, {
          fieldName: file.fieldname,
          'Content-Type': file.mimetype,
          'Cache_control': 'public, max-age=31536000'
        });
      },
      key: function (req, file, cb) {
        cb(null, file.fieldname + "/" + foo.getDateSerial())
      }
    })
  }),
  deleteAWSFile: (file_path) => {
    if (file_path) {
      let path_list = file_path.split('/').slice(3);
      file_key = path_list.join('/');
      let params = {
        Bucket: BUCKET_NAME,
        Key: file_key
      };
      s3bucket.deleteObject(params, function (error, data) {
        if (error) {
          console.log(error);
        }
      });
    }
  },
}