import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAHI0ylNQxYr1wp9A_CLvKEIKtfWVGEAvA',
  authDomain: 'bobikit-8b6a2.firebaseapp.com',
  projectId: 'bobikit-8b6a2',
  storageBucket: 'bobikit-8b6a2.appspot.com',
  messagingSenderId: '625164147985',
  appId: '1:625164147985:web:ecc1241fd4a363c701c0b0',
  measurementId: 'G-GQ5FG4LEMJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
