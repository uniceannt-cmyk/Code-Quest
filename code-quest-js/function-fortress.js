const levels = [

    {
  title: "Level 1 – The Greeting Bug",
  code: `#include <iostream>
     #include <string>
     using namespace std;

    class Fortress {
    public:
     static void greet(string name) {
        cout << /* ??? */ << endl;
        }
    };

    int main() {
        Fortress::greet("Knight");
    return 0;
    }`,
    answer: "Hello, Knight",
    hint: "Use cout to print a greeting with the name. Remember string concatenation in C++ uses +."
    },

  {
    title: "Level 2 – Summoning the Power",
    code: `public class Fortress {
    public static void main(String[] args) {
        int total = sum(5, 7);
        System.out.println("Total power: " + total);
    }
    public static int sum(int a, int b) {
        return /* ??? */;
    }`,
    answer: "a + b",
    hint: "Return the sum of a and b."
  },
  {
    title: "Level 3 – Defeating the Final Bug",
    code: `public class Fortress {
    public static void main(String[] args) {
        String shout = makeUpper("victory");
        System.out.println(shout);
    }
    public static String makeUpper(String word) {
        return /* ??? */;
    }`,
    answer: "word.toUpperCase()",
    hint: "Convert the word to uppercase."
  }
];

let currentLevel = 0;
let score = 0;
let seconds = 0;
let timerInterval;

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById("timer").textContent = seconds;
    localStorage.setItem("fortressTime", seconds);
  }, 1000);
}

function loadLevel() {
  const savedLevel = localStorage.getItem("fortressLevel");
  const savedScore = localStorage.getItem("fortressScore");
  const savedTime = localStorage.getItem("fortressTime");

  if (savedLevel !== null) currentLevel = parseInt(savedLevel);
  if (savedScore !== null) score = parseInt(savedScore);
  if (savedTime !== null) seconds = parseInt(savedTime);

  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = seconds;

  if (currentLevel >= levels.length) {
    document.getElementById("levelTitle").textContent = "🎉 All bugs defeated!";
    document.getElementById("codeBlock").textContent = "";
    document.getElementById("answer").style.display = "none";
    document.getElementById("result").textContent = `🎉 You cleared the fortress in ${seconds}s with ${score} points!`;
    clearInterval(timerInterval);
    return;
  }

  document.getElementById("levelTitle").textContent = levels[currentLevel].title;
  document.getElementById("codeBlock").textContent = levels[currentLevel].code;
  document.getElementById("answer").value = "";
  document.getElementById("result").textContent = "";
  document.getElementById("hintBox").textContent = "";
}

function checkAnswer() {
  const ans = document.getElementById("answer").value.trim().replace(/\s+/g, '');
  const expected = levels[currentLevel].answer;

  let isCorrect = false;

  if (Array.isArray(expected)) {
    isCorrect = expected.some(e => ans === e.replace(/\s+/g, ''));
  } else {
    isCorrect = ans === expected.trim().replace(/\s+/g, '');
  }

  if (isCorrect) {
    score += 100;
    currentLevel++;

    localStorage.setItem("fortressLevel", currentLevel);
    localStorage.setItem("fortressScore", score);

    document.getElementById("score").textContent = score;
    document.getElementById("result").textContent = "✅ Bug defeated!";
    document.getElementById("result").className = "message correct";

    if (currentLevel < levels.length) {
      setTimeout(loadLevel, 1000);
    } else {
      clearInterval(timerInterval);
      document.getElementById("result").textContent = `🎉 You cleared the fortress in ${seconds}s with ${score} points!`;
      document.getElementById("levelTitle").textContent = "🎉 All bugs defeated!";
      document.getElementById("codeBlock").textContent = "";
      document.getElementById("answer").style.display = "none";
    }
  } else {
    document.getElementById("result").textContent = "❌ The bug still lives. Try again.";
    document.getElementById("result").className = "message wrong";
  }
}

function showHint() {
  document.getElementById("hintBox").textContent = "💡 Hint: " + levels[currentLevel].hint;
  score -= 20;
  if (score < 0) score = 0;
  localStorage.setItem("fortressScore", score);
  document.getElementById("score").textContent = score;
}

function resetGame() {
  localStorage.removeItem("fortressLevel");
  localStorage.removeItem("fortressScore");
  localStorage.removeItem("fortressTime");
  location.reload();
}

startTimer();
loadLevel();
