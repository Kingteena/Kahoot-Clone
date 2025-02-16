import { db } from "./FirebaseController";
import { collection, setDoc, getDocs, getDoc, doc } from "firebase/firestore";

export async function writeToFirestore(collectionName, id, objectToSave) {
  try {
    await setDoc(doc(db, collectionName, id), objectToSave);
    console.log("Document written ", objectToSave);
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}

export function getFirestoreDocuments(collectionName) {
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
export async function getFirestoreDocumentData(subCollection, docName) {
  const docRef = doc(db, subCollection, docName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    throw new Error("Document does not exist");
  }
}
