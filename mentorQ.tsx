import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { FieldValue, getFirestore, addDoc, collection, getDocs } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyAqGfFX7gXRGBtidctQjIJ4NC0FA6YxeOQ",
    authDomain: "mentor-queue-c01a3.firebaseapp.com",
    projectId: "mentor-queue-c01a3",
    storageBucket: "mentor-queue-c01a3.appspot.com",
    messagingSenderId: "117425105410",
    appId: "1:117425105410:web:60fa2b3e348b489b37551b",
    measurementId: "G-NJ5ZBXKBX3"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


//finds the requests collection and returns the queue

const getRequestsData = async () => {
    try {
        const requestRef = collection(db, 'requests');
        const querySnapshot = await getDocs(requestRef);
        
        // checks if the requests database exists or not if it deos not exist then it weill log it
        if (querySnapshot.exists()) {
            //commmented beflow is a error checking function that logs whats being returned
            //console.log(querySnapshot.data())
            return querySnapshot.data();
        } 
        else {console.log("No such document!");}

    }catch(error){console.error('Error retrieving data:', error);}
};


// This function checks whether a student is in the queue based on the document key.
// It returns whether the student has been helped or not.
const inQueue = async (docKey) => {
    try {
        // Grabs the document
        const docRef = db.collection('requests').doc(docKey);
        // Gets the data from the doc
        const doc = await docRef.get();

        // Ensures that the document is retrieved properly
        if (!doc.exists) { console.log('No such document!');}
        else {return doc.data().helped;}
    } catch (error) {console.error('Error retrieving document:', error);}
};

// A function to fetch the data of a document, i.e., the student in the queue.
// It takes in a document key.
const fetchDoc = async (docKey) => {
    try {
        // Grabs the document
        const ans = await db.collection('requests').doc(docKey);
        console.log(ans.data());
        // Returns the data of that documen
        if (!ans.exists) { console.log('No such document!');}
        else {
            // below commented is a log function that could help error check
            // console.log('Document data:', doc.data());
            return ans.data();
        }
    } catch (error) {console.error('Error retrieving individual doc:', error);}
};