const { admin, db } = require("../util/admin");
const { validateSignupData, validateLoginData } = require("../util/validators");
const { sendVerificationEmail } = require("./email");
const config = require("../config");
const firebase = require("firebase");
firebase.initializeApp(config);

const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for
    // this URL must be whitelisted in the Firebase Console.
    url: 'https://pawpals-api.firebaseapp.com',
    // This must be true for email link sign-in.
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.example.ios',
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12',
    },
    dynamicLinkDomain: 'pawpals.page.link',
  };

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
    };

    const { valid, errors } = validateSignupData(newUser);

    if (!valid) {
        return res.status(400).json(errors);
    }
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
        Promise.all([
            admin.auth().setCustomUserClaims(data.user.uid, {
                admin: false,
            }),
            db.doc(`/users/${ data.user.uid }`).set({
                email: newUser.email,
                name: req.body.name,
                dogs: [],
                friends: [],
            }),
        ]).then(() => {
            admin
            .auth()
            .generateEmailVerificationLink(newUser.email, actionCodeSettings)
            .then(link => {
                const oobCode = link.toString().match(/(?<=oobCode%3D).*?(?=\s*%26)/)[0];
                sendVerificationEmail(newUser.email, oobCode).then(info => {
                    return res.status(200).json({ message: 'Account Created'})
                })
            })
        })
    })
    .catch((err) => {
        console.error(err);
        if (err.code === "auth/email-already-in-use") {
            return res.status(400).json({ email: "Email is already in use" });
        } else {
            return res.status(500).json({ error: err.code });
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

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({ token });
    })
    .catch(err => {
        console.error(err);
        if (err.code === 'auth/wrong-password'){
            return res.status(403).json({ general: 'Wrong credentials, please try again' });
        } else return res.status(500).json({ error: err.code });
    });
};

exports.checkClaims = (req, res) => {
    admin.auth().verifyIdToken(req.headers.token, true)
    .then((decodedToken) => {
        console.log(decodedToken)
        return res.status(200).json({ message: 'done' });
    })
    .catch((err) => {
        return res.status(401).json({ err }); 
    });
}