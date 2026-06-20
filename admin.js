import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYgyM1epQ9up8195FarX7gBnli1LQs2_U",
  authDomain: "activites-anniversaire.firebaseapp.com",
  projectId: "activites-anniversaire",
  storageBucket: "activites-anniversaire.firebasestorage.app",
  messagingSenderId: "613450740235",
  appId: "1:613450740235:web:c8c0d071afa6a045598d0e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document
  .getElementById("startVote")
  .addEventListener("click", async () => {

    await updateDoc(
      doc(db, "config", "vote"),
      {
        active: true
      }
    );

    alert("Vote lancé !");
});

document
  .getElementById("endVote")
  .addEventListener("click", async () => {

    await updateDoc(
      doc(db, "config", "vote"),
      {
        active: false
      }
    );

    alert("Vote terminé !");
});
