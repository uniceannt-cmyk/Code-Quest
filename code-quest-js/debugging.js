  const levels = [
    {
      title: "Level 1 – Sum of Array Elements",
      code: `public class Main {
    public static int sumArray(int[] arr) {
        int sum = 0;
        for(int i = 0; i < arr.length; i++) {
            sum += /* ??? */;
        }
        return sum;
    }`,
      answer: "arr[i]",
      hint: "You need to add each element of the array using its index."
    },
    {
      title: "Level 2 – Factorial Calculator",
      code: `public class Main {
    public static long factorial(int n) {
        long result = 1;
        for(int i = 1; i <= n; i++) {
            result *= /* ??? */;
        }
        return result;
    }`,
      answer: "i",
      hint: "Multiply by the loop counter."
    },
    {
      title: "Level 3 – Find Maximum Value",
      code: `public class Main {
    public static int findMax(int[] nums) {
        int max = nums[0];
        for(int i = 1; i < nums.length; i++) {
            if(nums[i] > /* ??? */) {
                max = nums[i];
            }
        }
        return max;
    }`,
      answer: "max",
      hint: "Compare each number with the current maximum."
    }
  ];

  let currentLevel = 0;
  let debugCompleted = 0;
  let dxp = 0;

  function loadLevel() {
    const savedLevel = localStorage.getItem("debuggingLevel");
    const savedQuests = localStorage.getItem("debuggingQuests");
    const savedXP = localStorage.getItem("debuggingXP");

    if (savedLevel !== null) currentLevel = parseInt(savedLevel);
    if (savedQuests !== null) debugCompleted = parseInt(savedQuests);
    if (savedXP !== null) dxp = parseInt(savedXP);

    if (currentLevel >= levels.length) {
      document.getElementById("levelTitle").textContent = "🎉 All levels completed!";
      document.getElementById("codeBlock").textContent = "";
      document.getElementById("answer").style.display = "none";
      document.getElementById("result").textContent = "🎉 You completed all levels!";
      document.getElementById("hintBox").textContent = "";
      return;
    }

    document.getElementById("levelTitle").textContent = levels[currentLevel].title;
    document.getElementById("codeBlock").textContent = levels[currentLevel].code;
    document.getElementById("answer").value = "";
    document.getElementById("answer").style.display = "block";
    document.getElementById("result").textContent = "";
    document.getElementById("hintBox").textContent = "";
  }

  function checkAnswer() {
    const ans = document.getElementById("answer").value.trim();
    if (ans === levels[currentLevel].answer) {
      document.getElementById("result").textContent = "✅ Correct! Moving to next level...";
      document.getElementById("result").className = "message correct";

      debugCompleted++;
      dxp += 20;
      currentLevel++;

      localStorage.setItem("debuggingLevel", currentLevel);
      localStorage.setItem("debuggingQuests", debugCompleted);
      localStorage.setItem("debuggingXP", dxp);

      setTimeout(loadLevel, 1500);
    } else {
      document.getElementById("result").textContent = "❌ Wrong answer, try again!";
      document.getElementById("result").className = "message wrong";
    }
  }

  function showHint() {
    document.getElementById("hintBox").textContent = levels[currentLevel].hint;
  }

  function resetProgress() {
    localStorage.removeItem("debuggingLevel");
    localStorage.removeItem("debuggingQuests");
    localStorage.removeItem("debuggingXP");
    currentLevel = 0;
    debugCompleted = 0;
    dxp = 0;
    loadLevel();
  }

  // Start the game
  loadLevel();
