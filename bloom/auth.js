var bcrypt = require("bcryptjs");
const saltRounds = 12;
const jwt = require('jsonwebtoken');

async function generateHash(pw) {
  try{
    let hash = await bcrypt.hash(pw, saltRounds)
    return hash
  }
  catch(err){
    return null
  }
}

async function verifyHash(dbPw, userPw) {
  try{
    let verified = await bcrypt.compare(userPw, dbPw)
    return verified
  }
  catch(err){
    return null
  }
}

const generateToken = (res, user) => {
  console.log("GENERATING TOKEN!")
  let id = user["id"] 
  let first_name = user["first_name"]
  let last_name = user["last_name"]
  delete user.password

  const expiration = process.env.DB_ENV === 'dev' ? 1 : 7;
  const token = jwt.sign({ id, first_name, last_name }, process.env.JWT_SECRET, {
    expiresIn: process.env.DB_ENV === 'dev' ? '1d' : '7d',
  });
  console.log("TOKEN GENERATED!, Setting in response")
  const date = new Date();
  date.setDate(date.getDate() + expiration)
  
  res.cookie('token', token, {
    expires: date,
    secure: false, // set to true if your using https
    httpOnly: false,
    domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN_PROD : process.env.DOMAIN_DEV
  });

  console.log("SET TOKEN COOKIE IN RESPONSE, HERE IS RESPONSE:", res)

  res.cookie('user', user, {
    expires: date,
    secure: false, // set to true if your using https
    httpOnly: false,
    domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN_PROD : process.env.DOMAIN_DEV
  })

  console.log("SET USER COOKIE IN RESPONSE, HERE IS RESPONSE:", res)

  return token
};

async function verifyToken(req, res, next) {
  const token = req.cookies.token || '';
  try {
    if (!token) {
      throw new Error("You need to Login");
      // return res.status(401).json('You need to Login')
    }
    const decrypt = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decrypt.id,
      first_name: decrypt.first_name,
      last_name: decrypt.last_name
    };
    // next();
  } catch (err) {
    throw err;
    // return res.status(500).json(err.toString());
  }
};

module.exports = {
    generateHash: generateHash,
    verifyHash: verifyHash,
    generateToken: generateToken,
    verifyToken: verifyToken,
};
