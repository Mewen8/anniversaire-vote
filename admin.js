import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyBYgyM1epQ9up8195FarX7gBnli1LQs2_U",
  authDomain: "activites-anniversaire.firebaseapp.com",
  projectId: "activites-anniversaire",
});

const db = getFirestore(app);
const voteRef = doc(db, "config", "vote");

/* LANCER VOTE */
document.getElementById("startVote").addEventListener("click", async () => {
  const snap = await getDoc(voteRef);
  const current = snap.data().voteId || 0;

  await updateDoc(voteRef, {
    active: true,
    voteId: current + 1
  });

  alert("Vote lancé !");
});

/* STOP VOTE */
document.getElementById("endVote").addEventListener("click", async () => {
  await updateDoc(voteRef, {
    active: false
  });

  alert("Vote terminé !");
});
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
