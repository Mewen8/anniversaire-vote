import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc
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

    const text = document.createTextNode(" " + data.name);

    label.appendChild(radio);
    label.appendChild(text);

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

    messageDiv.innerHTML =
      "✅ Ton vote a bien été enregistré !";

    voteForm.style.display = "none";
  } catch (error) {
    console.error(error);

    messageDiv.innerHTML =
      "❌ Erreur lors de l'enregistrement du vote.";
  }
});

loadActivities();
