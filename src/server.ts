import 'dotenv/config';
import App from "./app";
import UserController from "./user/user.controller";
import ProductController from "./product/product.controller";

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString,getDownloadURL } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);


// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(firebase);



const app = new App([new UserController(), new ProductController])

app.listen()

