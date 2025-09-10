let targetNumber = 0;
let steps = [];
let answerOrder = [];

function generatePuzzle() {
  const num1 = Math.floor(Math.random() * 8) + 2;
  const num2 = Math.floor(Math.random() * 8) + 2;
  targetNumber = num1 * num2;
  answerOrder = [
    `n = ${num1};`,
    `n = n * ${num2};`,
    `print(n);`
  ]
  steps = [...answerOrder].sort(() => Math.random() - 0.5);

  // Save puzzle to localStorage
  localStorage.setItem("pseudoTarget", targetNumber);
  localStorage.setItem("pseudoAnswerOrder", JSON.stringify(answerOrder));
  localStorage.setItem("pseudoSteps", JSON.stringify(steps));
  localStorage.removeItem("pseudoUserOrder"); // Reset user progress
}

function init(forceNew = false) {
  if (forceNew){
    generatePuzzle();
  } 
  else{
      // Load saved puzzle if available
  const savedTarget = localStorage.getItem("pseudoTarget");
  const savedAnswer = localStorage.getItem("pseudoAnswerOrder");
  const savedSteps = localStorage.getItem("pseudoSteps");
  const savedUserOrder = localStorage.getItem("pseudoUserOrder");

  if (savedTarget && savedAnswer && savedSteps) {
    targetNumber = parseInt(savedTarget);
    answerOrder = JSON.parse(savedAnswer);
    steps = JSON.parse(savedSteps);
  } else {
    generatePuzzle();
  }
}

  document.getElementById('target').textContent = `Target Number: ${targetNumber}`;
  document.getElementById('pool').innerHTML = "<h3>Available Steps</h3>";
  document.getElementById('order').innerHTML = "<h3>Your Order</h3>";
  document.getElementById('result').textContent = '';

  steps.forEach(step => {
    const div = document.createElement('div');
    div.textContent = step;
    div.classList.add('item');
    div.draggable = true;
    document.getElementById('pool').appendChild(div);
  });

  // Restore user's previous order
  enableDragDrop();
}

function enableDragDrop() {
  document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('dragstart', () => item.classList.add('dragging'));
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      saveUserOrder(); // Save progress after drop
    });
  });

  document.querySelectorAll('.column').forEach(col => {
    col.addEventListener('dragover', e => {
      e.preventDefault();
      const dragging = document.querySelector('.dragging');
      if (dragging && dragging.parentElement !== col) {
        col.appendChild(dragging);
      }
    });
  });
}

function saveUserOrder() {
  const orderItems = [...document.getElementById('order').querySelectorAll('.item')]
    .map(el => el.textContent.trim());
  localStorage.setItem("pseudoUserOrder", JSON.stringify(orderItems));
}

function checkOrder() {
  const orderItems = [...document.getElementById('order').querySelectorAll('.item')]
    .map(el => el.textContent.trim());

  if (orderItems.length !== answerOrder.length) {
    document.getElementById('result').innerHTML =
      '<span class="wrong">⚠️ Arrange all steps first!</span>';
    return;
  }
  if (JSON.stringify(orderItems) === JSON.stringify(answerOrder)) {
    document.getElementById('result').innerHTML =
      '<span class="correct">✅ Correct! You matched the target!</span>';

      setTimeout(() => {
        generatePuzzle();
        init();
      }, 1500);
  } else {
    document.getElementById('result').innerHTML =
      `<span class="wrong">❌ Incorrect!</span><br>
      Correct order:<br>${answerOrder.join('<br>')}`;
  }
}

init();
