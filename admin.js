import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
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

const resultsDiv = document.getElementById("results");

document.getElementById("startVote").addEventListener("click", async () => {
await updateDoc(doc(db, "config", "vote"), {
active: true
});

alert("Vote lancé !");
});

document.getElementById("endVote").addEventListener("click", async () => {
await updateDoc(doc(db, "config", "vote"), {
active: false
});

alert("Vote terminé !");
});

async function showResults() {

const activitiesSnapshot =
await getDocs(collection(db, "activities"));

const votesSnapshot =
await getDocs(collection(db, "votes"));

const activityNames = {};

activitiesSnapshot.forEach((activityDoc) => {
activityNames[activityDoc.id] =
activityDoc.data().name;
});

const counts = {};

votesSnapshot.forEach((voteDoc) => {


const activity =
  voteDoc.data().activity;

counts[activity] =
  (counts[activity] || 0) + 1;


});

let html = "";

for (const id in counts) {


html +=
  "<p><strong>" +
  activityNames[id] +
  "</strong> : " +
  counts[id] +
  " vote(s)</p>";


}

resultsDiv.innerHTML = html;
}

showResults();

setInterval(showResults, 5000);
