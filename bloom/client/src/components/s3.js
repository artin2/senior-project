// export let getPictures = async(prefixPassed) => {
// module.exports.getPictures = async function(prefixPassed) {
//   await getPictures(prefixPassed);
// }
// var getPictures = async function(prefixPassed) {

// getting an export error, going to leave it for now
// async function getPictures(prefixPassed) {
//   console.log("herererere")
//   const response = await fetch('http://localhost:8081/getImages', {
//       method: "POST",
//       headers: {
//           'Content-type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify({prefix: prefixPassed})
//     })
//   const pictures = await response.json()
//   console.log("here", pictures)

//   return pictures
// }

// module.exports.getPictures = getPictures;