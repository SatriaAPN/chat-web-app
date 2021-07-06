const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '../crypto/', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

