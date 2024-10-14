import { firestore } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
export const getDocuments = async () => {
  const myCollection = collection(firestore, "farmers");
  const querySnapshot = await getDocs(myCollection);
  const farmers = querySnapshot.docs.map((doc) => doc.data());
  return farmers;
};
