const { admin, db } = require("../util/admin");
const {
  validateSignupData,
  validateLoginData
} = require("../util/validators");

const config = require("../config");
const firebase = require("firebase");
firebase.initializeApp(config);

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  }

  const docRef = db.collection("users").doc(newUser.username);

  docRef.get().then((doc) => {
    if (doc.exists) {
      return res.status(400).json({ username: "Username is already in use" });
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(data => {
            admin.auth().setCustomUserClaims(newUser.username, {
                username: newUser.username,
            });
            docRef.set({
                username: newUser.username,
                email: newUser.email,
                uid: data.user.uid,
                playlists: [],
                followedPlaylists: [],
                friends: [],
                dateJoined: Date.now(),
                role: 'user',
            });
            return res
            .status(201)
            .json({ message: `${req.body.email} is now signed up` });
        })
        .catch((err) => {
          console.error(err);
          if (err.code === "auth/email-already-in-use") {
            return res.status(400).json({ email: "Email is already in use" });
          } else {
            return res.status(500).json({ error: err.code });
          }
        });
    }
  });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" });
      } else return res.status(500).json({ error: err.code });
    });
};