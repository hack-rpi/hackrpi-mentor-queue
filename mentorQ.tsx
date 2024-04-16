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


const getAverageWaitTime = async () => {
    try {
      const requestsCollection = collection(db, 'requests');
      const querySnapshot = await getDocs(requestsCollection);
  
      let totalWaitTime = 0;
      let totalStudents = 0;
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const addedTimestamp = data.addedTimestamp; // Timestamp when student was added to the queue
        const helpedTimestamp = data.helpedTimestamp; // Timestamp when student was helped
  
        if (addedTimestamp && helpedTimestamp) {
          // Calculate the time spent in the queue in milliseconds
          const waitTime = helpedTimestamp - addedTimestamp;
  
          // Add the wait time to the total
          totalWaitTime += waitTime;
          totalStudents++;
        }
      });
  
      if (totalStudents === 0) {console.log('No data available to calculate average wait time.');}
      else{
        // Calculate the average wait time in minutes
        const averageWaitTime = totalWaitTime / (totalStudents * 60000); // Convert milliseconds to minutes
        console.log(`Average Wait Time: ${averageWaitTime.toFixed(2)} minutes`);
      }
    } catch (error) {
      console.error('Error calculating average wait time:', error);
    }
};
/*-------------------------------------------------------------------------
data logger below
-------------------------------------------------------------------------*/
const getQueueStatistics = async () => {
    try {
      const totalStudentsPromise = getTotalStudentsInQueue();
      getAverageWaitTime();
  
      const [totalStudents] = await Promise.all([
        totalStudentsPromise,
      ]);
  
      console.log(`Total Students in Queue: ${totalStudents}`);
    } catch (error) {
      console.error('Error in getQueueStatistics:', error);
    }
};
/*-------------------------------------------------------------------------
Not super nessesary below
-------------------------------------------------------------------------*/

const getTimeSinceLastHelped = async (studentId) => {
    try {
      // Fetch the student's document using the studentId
      const studentDoc = await db.collection('students').doc(studentId).get();
  
      if (!studentDoc.exists) {
        console.log('No such student found!');
        return;
      }
  
      const studentData = studentDoc.data();
      const lastHelpedTimestamp = studentData.lastHelpedTimestamp; // Assuming this is the field where the last helped timestamp is stored
  
      if (!lastHelpedTimestamp) {
        console.log('This student has not been helped before.');
        return;
      }
  
      // Current timestamp
      const now = new Date().getTime();
  
      // Calculate the time since the student was last helped in minutes
      const timeSinceLastHelped = (now - lastHelpedTimestamp.toMillis()) / 60000; // Convert from milliseconds to minutes
  
      console.log(`Time since last helped: ${timeSinceLastHelped.toFixed(2)} minutes`);
      return timeSinceLastHelped.toFixed(2); // Return the time in minutes, rounded to 2 decimal places
    } catch (error) {
      console.error('Error in getTimeSinceLastHelped:', error);
    }
  };

// Gets the total number of students in the queue.
const getTotalStudentsInQueue = async () => {
    try {
        const requestsCollection = collection(db, 'requests');
        const querySnapshot = await getDocs(requestsCollection);
        const totalStudents = querySnapshot.size;
        console.log(`Total Students in Queue: ${totalStudents}`);
        return totalStudents;
    } catch (error) {
        console.error('Error calculating total students in queue:', error);
        return 0;
    }
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
