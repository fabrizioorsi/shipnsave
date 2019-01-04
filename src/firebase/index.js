/**
 * Firebase Login
 * Vuely comes with built in firebase login feature
 * You Need To Add Your Firsebase App Account Details Here
 */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Initialize Firebase 
const config = {
    apiKey: "AIzaSyDQ56ZGT4hAZXL1RGeKRnGyuUu1bduIvMI",
    authDomain: "shipnsave-mtl.firebaseapp.com",
    databaseURL: "https://shipnsave-mtl.firebaseio.com",
    projectId: "shipnsave-mtl",
    storageBucket: "shipnsave-mtl.appspot.com",
    messagingSenderId: "615411731524" 
};

firebase.initializeApp(config);

const auth = firebase.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
const database = firebase.database();

export {
    auth,
    googleAuthProvider,
    githubAuthProvider,
    facebookAuthProvider,
    twitterAuthProvider,
    database
};
