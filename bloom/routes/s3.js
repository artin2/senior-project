// //CITATION: https://www.koan.co/blog/uploading-images-to-s3-from-a-react-spa
// var aws = require('aws-sdk'); 
// const helper = require('../helper.js')
// require('dotenv').config();

// aws.config.update({
//   region: process.env.AWSRegion,
//   accessKeyId: process.env.AWSAccessKeyId,
//   secretAccessKey: process.env.AWSSecretKey
// })

// async function getPresignedUploadUrl(req, res) {
//   const s3 = new aws.S3();  // Create a new instance of S3
//   const fileName = req.body.fileName;
//   const fileType = req.body.fileType;

//   const url = await s3
//     .getSignedUrl('putObject', {
//       Bucket: process.env.AWSBucket,
//       Key: fileName,
//       Expires: 500,
//       ContentType: fileType,
//       // ACL: 'public-read'
//       Expires: 300,
//     })

//   helper.querySuccess(res, url, "Successfuly got url")
// }

// module.exports = {
//   getPresignedUploadUrl: getPresignedUploadUrl
// };

// //CITATION: https://medium.com/@khelif96/uploading-files-from-a-react-app-to-aws-s3-the-right-way-541dd6be689
// var aws = require('aws-sdk'); 
// const helper = require('../helper.js')
// require('dotenv').config();

// aws.config.update({
//   region: process.env.AWSRegion,
//   accessKeyId: process.env.AWSAccessKeyId,
//   secretAccessKey: process.env.AWSSecretKey
// })

// async function getPresignedUploadUrl(req, res) {
//   const s3 = new aws.S3({
//     region: process.env.AWSRegion,
//     accessKeyId: process.env.AWSAccessKeyId,
//     secretAccessKey: process.env.AWSSecretKey
//   });  // Create a new instance of S3
//   const fileName = req.body.fileName;
//   const fileType = req.body.fileType;

//   const s3Params = {
//     Bucket: process.env.AWSBucket,
//     Key: fileName,
//     Expires: 500,
//     ContentType: fileType,
//     ACL: 'public-read'
//   };

//   s3.getSignedUrl('putObject', s3Params, (err, data) => {
//     console.log("here")
//     if(err){
//       console.log("there");
//       helper.queryError(res, "Unable to get url")
//     }

//     const returnData = {
//       signedRequest: data,
//       url: `https://${process.env.AWSBucket}.s3.amazonaws.com/${fileName}`
//     };

//     console.log("2")

//     helper.querySuccess(res, returnData, "Successfuly got url")
//   });
// }

// module.exports = {
//   getPresignedUploadUrl: getPresignedUploadUrl
// };



//CITATION: https://medium.com/@khelif96/uploading-files-from-a-react-app-to-aws-s3-the-right-way-541dd6be689
var aws = require('aws-sdk'); 
const helper = require('../helper.js')
require('dotenv').config();

async function getPresignedUploadUrl(req, res) {
  const s3 = new aws.S3({
    region: process.env.AWSRegion,
    accessKeyId: process.env.AWSAccessKey,
    secretAccessKey: process.env.AWSSecretKey
  });  // Create a new instance of S3
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;

  await s3.getSignedUrl('putObject', {
    Bucket: process.env.AWSBucket,
    Key: fileName,
    Expires: 500,
    ContentType: fileType
  }, (error, url) => {
    console.log(fileName)
      if (error) {
        helper.queryError(res, "Unable to get url")
      }
      helper.querySuccess(res, url, "Successfuly got url")
  });
}

module.exports = {
  getPresignedUploadUrl: getPresignedUploadUrl
};