// export let getPictures = async(prefixPassed) => {
// module.exports.getPictures = async function(prefixPassed) {
//   await getPictures(prefixPassed);
// }
// var getPictures = async function(prefixPassed) {

// getting an export error, going to leave it for now

async function getPictures(prefixPassed) {
  const response = await fetch('http://localhost:8081/getImages', {
      method: "POST",
      headers: {
          'Content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({prefix: prefixPassed})
    })
  const pictures = await response.json()

  return pictures
}

// function for uploading all selected files to s3
async function uploadHandler(prefix, selectedFiles) {
  // upload each image to s3
  // have to get presigned url from server before uploading directly
  for(let i = 0; i < selectedFiles.length; i++){
    var tempDate = new Date();
    var date = '_' + tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate() +' '+ tempDate.getHours()+':'+ tempDate.getMinutes()+':'+ tempDate.getSeconds();

    let values = {
      fileName: prefix + selectedFiles[i].name + date, // add the current time so its unique..
      fileType: selectedFiles[i].type
    }

    const response = await fetch('http://localhost:8081/getPresignedUrl/', {
      method: "POST",
      headers: {
          'Content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(values)
    })
    const url = await response.json()

    const responseS3 = await fetch(url, {
        method: "PUT",
        headers: {
            'Content-type': selectedFiles[i].type
        },
        body: selectedFiles[i]
      })
    
    // if(responseS3.status!==200){
    //   // throw an error alert
    //   store.dispatch(addAlert(response))
    // }
  }
}

export { getPictures, uploadHandler}