import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDf8f2Moy0mR3YCHXZ3ZKU9FI6rIZtIA9c',
  authDomain: 'bookvote-3baf2.firebaseapp.com',
  databaseURL: 'https://bookvote-3baf2.firebaseio.com/',
  projectId: 'bookvote-3baf2',
  storageBucket: 'bookvote-3baf2.appspot.com',
  messagingSenderId: '511267981080',
  appId: '1:511267981080:ios:81f46ec0b680528bb1806d',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };