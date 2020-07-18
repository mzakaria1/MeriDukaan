var admin = require("firebase-admin");

var serviceAccount = require("./googleAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://meri-dukaan-a0d75.firebaseio.com",
});

module.exports = { app };
