import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyBYgyM1epQ9up8195FarX7gBnli1LQs2_U",
  authDomain: "activites-anniversaire.firebaseapp.com",
  projectId: "activites-anniversaire",
});

const db = getFirestore(app);
const voteRef = doc(db, "config", "vote");
const resultsDiv = document.getElementById("results");
let currentWinnerId = null;
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

async function showResults() {

  const activitiesSnapshot =
    await getDocs(collection(db, "activities"));

  const votesSnapshot =
    await getDocs(collection(db, "votes"));

  const voteConfig = await getDoc(voteRef);
  const currentVoteId = voteConfig.data().voteId;

  const activityNames = {};

  activitiesSnapshot.forEach((activityDoc) => {
    activityNames[activityDoc.id] =
      activityDoc.data().name;
  });

  const counts = {};

  votesSnapshot.forEach((voteDoc) => {

    const voteData = voteDoc.data();

    if (voteData.voteId !== currentVoteId) {
      return;
    }

    const activity = voteData.activity;

    counts[activity] =
      (counts[activity] || 0) + 1;
  });

  let html = "";

  let winnerId = null;
  let maxVotes = 0;

  for (const id in counts) {

    html +=
      "<p><strong>" +
      activityNames[id] +
      "</strong> : " +
      counts[id] +
      " vote(s)</p>";

    if (counts[id] > maxVotes) {
      maxVotes = counts[id];
      winnerId = id;
      currentWinnerId = id;
    }
  }

  resultsDiv.innerHTML = html;
}
showResults();
setInterval(showResults, 5000);

document
  .getElementById("removeWinner")
  .addEventListener("click", async () => {

    if (!currentWinnerId) {
      alert("Aucun gagnant disponible.");
      return;
    }

    const confirmation = confirm(
      "Supprimer l'activité gagnante ?"
    );

    if (!confirmation) {
      return;
    }

    await deleteDoc(
      doc(db, "activities", currentWinnerId)
    );

    alert("Activité supprimée.");

    showResults();
});
