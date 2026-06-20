import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc
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

const activitiesDiv = document.getElementById("activities");
const statusDiv = document.getElementById("status");
const voteForm = document.getElementById("voteForm");
const messageDiv = document.getElementById("message");

async function loadActivities() {
activitiesDiv.innerHTML = "";

const snapshot = await getDocs(collection(db, "activities"));

snapshot.forEach((activityDoc) => {
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

voteForm.addEventListener("submit", async (e) => {
e.preventDefault();

const selected = document.querySelector(
'input[name="activity"]:checked'
);

if (!selected) {
alert("Choisis une activité.");
return;
}

try {
await addDoc(collection(db, "votes"), {
activity: selected.value,
createdAt: Date.now()
});


messageDiv.textContent =
  "✅ Ton vote a bien été enregistré !";

statusDiv.textContent = "";

activitiesDiv.style.display = "none";

const voteButton =
  document.getElementById("voteButton");

if (voteButton) {
  voteButton.style.display = "none";
}


} catch (error) {
console.error(error);


messageDiv.textContent =
  "❌ Erreur lors de l'enregistrement du vote.";


}
});

async function checkVoteStatus() {

  const voteDoc = await getDoc(
    doc(db, "config", "vote")
  );

  const vote
  
loadActivities();
