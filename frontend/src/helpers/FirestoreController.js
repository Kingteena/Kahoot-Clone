import { db } from "./FirebaseController";
import { collection, addDoc, getDocs } from "firebase/firestore";

export function writeToFirestore(collectionName, objectToSave) {
  addDoc(collection(db, collectionName), objectToSave)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      return docRef;
    })
    .catch((e) => console.error("Error adding document: ", e));
}

export function readFromFirestore(collectionName) {
  getDocs(collection(db, collectionName))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data}`);
      });
    })
    .catch((e) => {
      console.error("Error Fetching document: ", e);
    });
}
