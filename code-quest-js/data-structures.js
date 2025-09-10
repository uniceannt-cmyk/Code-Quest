
const rooms = [
  {
    question: `let relics = [42, 7, 13, 99];  
Which command sorts them from smallest to largest?`,
    choices: ["relics.sort()", "relics.sort((a,b)=>a-b)", "relics.reverse()"],
    correct: "relics.sort((a,b)=>a-b)"
  },
  {
    question: `let chest = { ruby: 500, emerald: 1200, sapphire: 900 };  
How do you get the emerald's value?`,
    choices: ["chest['emerald']", "chest.emerald", "chest.get('emerald')"],
    correct: "chest.emerald"
  },
  {
    question: `let warriors = [34, 67, 89, 21];  
Which gets the strongest warrior's attack value?`,
    choices: ["Math.max(warriors)", "Math.max(...warriors)", "warriors.max()"],
    correct: "Math.max(...warriors)"
  }
];

let unlocked = 1;

// Load saved progress
const savedUnlocked = localStorage.getItem("templeUnlocked");
if (savedUnlocked !== null) {
  unlocked = parseInt(savedUnlocked);
}

// Unlock previously completed rooms
document.querySelectorAll(".room").forEach((room, index) => {
  if (index < unlocked) {
    room.classList.remove("locked");
  }
});

function enterRoom(index) {
  if (index >= unlocked) {
    alert("🚪 This room is locked. Solve previous rooms first.");
    return;
  }
  loadQuestion(index);
}

function loadQuestion(index) {
  const qBox = document.getElementById("questionBox");
  qBox.style.display = "block";
  document.getElementById("questionText").innerText = rooms[index].question;
  const choiceContainer = document.getElementById("choices");
  choiceContainer.innerHTML = "";
  document.getElementById("feedback").innerText = "";
  rooms[index].choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.className = "choice";
    btn.onclick = () => checkAnswer(choice, index);
    choiceContainer.appendChild(btn);
  });
}

function checkAnswer(selected, index) {
  const feedback = document.getElementById("feedback");
  if (selected === rooms[index].correct) {
    feedback.innerText = "✅ Correct! The door opens.";
    feedback.className = "correct";

    if (unlocked <= index + 1) {
      unlocked = index + 2;
      localStorage.setItem("templeUnlocked", unlocked);
      document.querySelectorAll(".room")[unlocked - 1]?.classList.remove("locked");
    }
  } else {
    feedback.innerText = "❌ Wrong! Try again.";
    feedback.className = "wrong";
  }
}

function resetTemple() {
  localStorage.removeItem("templeUnlocked");
  location.reload();
}
