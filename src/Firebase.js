import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import 'typeface-roboto';

const settings = { };

const config = {
  apiKey: "AIzaSyCH142KEm6RrVR7myU2jib_5XSEPxKJ2lg",
  authDomain: "unmatched-survey.firebaseapp.com",
  databaseURL: "https://unmatched-survey.firebaseio.com",
  projectId: "unmatched-survey",
  storageBucket: "unmatched-survey.appspot.com",
  messagingSenderId: "116235234522",
  appId: "1:116235234522:web:a53c3809e3bf20bfce89e3",
  measurementId: "G-6WMJEQBLQJ"
};
// Initialize Firebase
firebase.initializeApp(config);
firebase.analytics();

firebase.firestore().settings(settings);

export default firebase;