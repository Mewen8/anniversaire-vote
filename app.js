import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("APP JS CHARGÉ");

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

/* ELEMENTS */
const activitiesDiv = document.getElementById("activities");
const statusDiv = document.getElementById("status");
const voteForm = document.getElementById("voteForm");
const messageDiv = document.getElementById("message");
let voteId = null;
/* STATE */
let voteActive = false;

/* LOAD ACTIVITIES */
async function loadActivities() {
  activitiesDiv.innerHTML = "";

  const snapshot = await getDocs(collection(db, "activities"));
 snapshot.forEach((activityDoc) => {

  const data = activityDoc.data();

  if (data.active === false) {
    return;
  }
    const data = activityDoc.data();

    const div = document.createElement("div");
    div.className = "activity";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "activity";
    radio.value = activityDoc.id;

    const label = document.createElement("label");
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + data.name));

    div.appendChild(label);
    activitiesDiv.appendChild(div);
  });

  statusDiv.textContent = "Choisis une activité puis vote.";
}

/* SUBMIT VOTE */
voteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const selected = document.querySelector('input[name="activity"]:checked');

  if (!selected) {
    alert("Choisis une activité.");
    return;
  }

  if (!voteActive) {
    alert("Le vote est fermé.");
    return;
  }

  if (localStorage.getItem("vote_" + voteId) === "true") {
    alert("Tu as déjà voté.");
    return;
  }

  try {
    await addDoc(collection(db, "votes"), {
      activity: selected.value,
      voteId: voteId,
      createdAt: Date.now()
    });

    localStorage.setItem("vote_" + voteId, "true")
    
    messageDiv.textContent = "✅ Ton vote a bien été enregistré !";
    activitiesDiv.style.display = "none";
    statusDiv.textContent = "";

    const btn = document.getElementById("voteButton");
    if (btn) btn.style.display = "none";

  } catch (error) {
    console.error(error);
    messageDiv.textContent = "❌ Erreur lors de l'enregistrement du vote.";
  }
});

/* LIVE LISTENER FIRESTORE */
const voteDocRef = doc(db, "config", "vote");

onSnapshot(voteDocRef, (voteDoc) => {
  console.log("LIVE UPDATE");

  if (!voteDoc.exists()) {
    statusDiv.textContent = "❌ config/vote introuvable";
    return;
  }

 const data = voteDoc.data();

voteActive = data.active;
voteId = data.voteId; 
  
const hasVoted = localStorage.getItem("vote_" + voteId) === "true";

  if (!voteActive) {
    statusDiv.textContent = "⏸️ Aucun vote en cours.";
    activitiesDiv.style.display = "none";

    const btn = document.getElementById("voteButton");
    if (btn) btn.style.display = "none";

    return;
  }

  if (hasVoted) {
    statusDiv.textContent = "✅ Tu as déjà participé au vote.";
    activitiesDiv.style.display = "none";

    const btn = document.getElementById("voteButton");
    if (btn) btn.style.display = "none";

    return;
  }

  statusDiv.textContent = "🟢 Vote ouvert ! Choisis une activité.";
  messageDiv.textContent = "";
  activitiesDiv.style.display = "block";

  const btn = document.getElementById("voteButton");
  if (btn) btn.style.display = "block";

  loadActivities();
});
