const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToPrivKey = path.join(__dirname, '../crypto/', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8');
const pathToPubKey = path.join(__dirname, '../crypto/', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 * 
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 * 
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function verifyPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

/**
 * 
 * @param {*} password - The password string that the user inputs to the password field in the register form
 * 
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 * 
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}


/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user) {
  const _id = user._id;

  const expiresIn = '1d';

  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

function authVerif(req, res, next) {
  if(!req.cookies.token && !req.headers.token ){
    next();
    return;
  }

  let tokenParts;
  if(req.cookies.token){
    tokenParts = req.cookies.token.split(' ');
  }else{
    tokenParts = req.headers.token.split(' ');
    tokenParts[1] = tokenParts[1].slice(0, -1);
  }
  
  
  if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
    try {
      const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] });
      req.jwt = verification;
      next();
    } catch(err) {
      res.status(401).json({ success: false, msg: "You are not authorized to visit this route1" });
    }

  } else {
    res.status(401).json({ success: false, msg: "You are not authorized to visit this route2" });
  }

}

/**
 * 
 * @param {*} chatReceived 
 * @param {*} chatSended 
 * @returns 
 * 
 * this function sorting an arr of object from chatReceived and chatSended and form
 * a new array that contain both chatReceived and chatSended, sorted by date(oldes-most recent)
 */
function chatSorting(chatReceived, chatSended){
  const received = chatReceived.length;
  let i=0;
  const sended = chatSended.length;
  let j=0;
  let arr = [];
  while(received > i || sended > j ){
      if(received === i){
        arr.push(chatSended[j]);
        j++;
      }
      else if(sended === j){
          arr.push(chatReceived[i]);
          i++;
      }
      else{
          if(chatReceived[i].date.getTime() < chatSended[j].date.getTime()){
              arr.push(chatReceived[i]);
              i++;
          }else{
              arr.push(chatSended[j]);
              j++;
          }
      }
  }

  return arr;
}

module.exports.verifyPassword = verifyPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.authVerif = authVerif;
module.exports.chatSorting = chatSorting;