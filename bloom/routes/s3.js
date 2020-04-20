//CITATION: https://medium.com/@khelif96/uploading-files-from-a-react-app-to-aws-s3-the-right-way-541dd6be689
var aws = require('aws-sdk'); 
// var fs = require('fs');
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
      if (error) {
        helper.queryError(res, "Unable to get url")
      }
      else{
        helper.querySuccess(res, url, "Successfuly got url")
      }
  });
}

async function getImages(req, res) {
  const s3 = new aws.S3({
    region: process.env.AWSRegion,
    accessKeyId: process.env.AWSAccessKey,
    secretAccessKey: process.env.AWSSecretKey
  });  // Create a new instance of S3

  let pictures = await s3.listObjectsV2({
    Bucket: process.env.AWSBucket,
    Prefix: req.body.prefix
  }).promise()

  let signedUrls = []
  for (let i = 0; i < pictures.Contents.length; i++) {
    var params = {
      Bucket: process.env.AWSBucket, // bucket name
      Key: pictures.Contents[i].Key
    };
    var signedUrl = await getSignedUrl(s3, params)
    signedUrls.push({
      key: pictures.Contents[i].Key,
      url: signedUrl
    })
  }

  // async.eachLimit(pictures, 10, function(picture, next) { 
  //   var params = {
  //       Bucket: process.env.AWSBucket, // bucket name
  //       Key: picture.Key
  //   };
  //   s3.getObject(params, function(err, data) {
  //       if (err) {
  //           console.log('get image files err',err, err.stack); // an error occurred

  //       } else {
  //           zip.file(pictures.indexOf(picture) + picture.name, data.Body);
  //           next();
  //       }
  //   });
  // }, function(err) {
  //     if (err) {
  //         console.log('err', err);

  //     } else {
  //         content = zip.generate({
  //             type: 'nodebuffer'
  //         });
  //         console.log(content)
  //     }
  // });

  helper.querySuccess(res, signedUrls, "Successfuly got pictures")
}

async function deleteImages(req, res) {
  const s3 = new aws.S3({
    region: process.env.AWSRegion,
    accessKeyId: process.env.AWSAccessKey,
    secretAccessKey: process.env.AWSSecretKey
  });  // Create a new instance of S3

  for (let i = 0; i < req.body.keys.length; i++) {
    var params = { Bucket: process.env.AWSBucket, Key: req.body.keys[i] };

    await s3.deleteObject(params, function(err, data) {
      if (err) console.log(err);  // error
      else     console.log("deleted"); // deleted
    });
  }

  // should fix this
  helper.querySuccess(res, {}, "Successfuly deleted from s3!")
}

async function getSignedUrl(s3, params){
  return new Promise((resolve,reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) reject(err)
      resolve(url);
    })
});
}


// function getBucketObject(urlParams){
//   return  new Promise ((resolve, reject)=> { 
//     let pathToSave = '/local-files/'+params.Key;
//     let tempFile = fs.createWriteStream(pathToSave);
//     let stream = s3.getObject(params).createReadStream().pipe(tempFile);
//     let had_error = false;
//     stream.on('error', function(err){
//       had_error = true;
//     });
//     stream.on('close', function(){
//       if (!had_error) {
//         resolve(pathToSave);
//       } 
//     });
//   })
// }

module.exports = {
  getPresignedUploadUrl: getPresignedUploadUrl,
  getImages: getImages,
  deleteImages: deleteImages
};