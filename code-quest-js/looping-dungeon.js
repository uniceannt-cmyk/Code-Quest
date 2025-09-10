
const levels = [
  // Level 1: small grid, one bug guarding a key, rescue at bottom-right
  {
    name: "Cellar of For-Loops",
    rows: 7, cols: 9,
    map: [
      "WWWWWWWWW",
      "W..K...BW",
      "W.W.W.W.W",
      "W..W.W..W",
      "W.W.W.W.W",
      "W...B..GW",
      "WWWWWWWWW",
    ],
    bugTraps: {
        "1,7": {blockDown: true},
        "5,4": {blockRight: true}
    },
    puzzles: [
      {
        pos: [3,5], // coordinates row,col for B at (1,4)
        code: `public class Example {
  static int sumArray(int[] arr) {
    int sum = 0;
    for (int i = 0; i < arr.length; i++) {
      sum += /* ??? */; // fix me
    }
    return sum;
  }
}`,
        answers: ["arr[i]"],
        hint: "You're inside a for-loop — add the current element."
      },

      {
        pos: [1, 7],
        code: `public class Example {
  static int sumFromIndex(int [] arr) {
        int sum = 0;
    for (int i = /*???*/; i <= arr.length; i++) {
      sum += arr[i];
    }
      return sum;
  }
}`,
        answers: ["1"],
        hint: "The loop is supposed to skip the first element and start from index 1. What should i be initialized to?"
      },
      
      {
        pos: [5,4],
        code: `class Factor {
  static long factorial(int n) {
    long r = 1;
    for (int i = 1; i <= n; i++) {
      r *= /* ??? */; // fix me
    }
    return r;
  }
}`,
        answers: ["i"],
        hint: "Multiply by the loop counter."
      }
    ]
  },

  // Level 2: slightly bigger, two bugs and one needs LinkedHashSet pair
  {
    name:"Dungeon of Off-by-One",
    rows:7, cols:11,
    map:[
      "WWWWWWWWWWW",
      "W....B....W",
      "W.WWW.WWW.W",
      "WBK..W..K.W",
      "W.WWW.WWW.W",
      "W.....B..GW",
      "WWWWWWWWWWW",
    ],
    bugTraps: {
      "1,5": { blockRight: true },
      "3,1": { blockDown: true },
      "5,6": { blockRight: true }
    },
    puzzles:[
      {
        pos:[1,5],
        code:`class MaxFinder{
  static int findMax(int[] a){
    int max = a[0];
    for (int i = 1; i < a.length; i++){
      if (a[i] > /* ??? */) { max = a[i]; }
    }
    return max;
  }
}`,
        answers:["max"], hint:"Compare current element to the running max."
      },
      {
        pos:[5,6],
        code:`import java.util.*;
class U{
  static List<Integer> unique(List<Integer> xs){
    Set<Integer> seen = new LinkedHashSet<>();
    for(Integer x : xs){
      if(!seen /* ??? */){
        seen /* ??? */;
      }
    }
    return new ArrayList<>(seen);
  }
}`,
        answers:["contains(x)|add(x)"], hint:"Use seen.contains(x) then seen.add(x)."
      },

            {
        pos:[3,1],
        code:`class Factor {
    static long factorial(int n) {
        if (n < 0) {
            System.out.println("⚠️ Negative input! Factorials need non-negative numbers.");
            return -1;
        }
        if (n == 0 || n == 1) return 1;
        return n * factorial(n - 1);
    }
}`,
        answers:["return n * factorial(n - 1);"], 
        hint:"Keep going until you hit the base case: factorial(1) or factorial(0) Use recursion to build the result from the inside out."
      },

      {
        pos:[5,8],
        code:`class R {
  static String rev(String s){
    return new StringBuilder(s)/* ??? */; // fix
  }
}`,
        answers:[".reverse().toString()"], hint:"Call reverse() on StringBuilder, then toString()."
      }
    ],
  }
];

const originalMaps = levels.map(lvl => lvl.map.slice());
const bugTraps = {
  '1,7': { blockDown: true },
};


/* Game state */
let state = {
  levelIndex: 0,
  player: {r:0,c:0},
  keys:0,
  score:0,
  time:0,
  solved:{},
  lockedUntilSolved: false
};

const boardWrap = document.getElementById('boardWrap');
const uiLevel = document.getElementById('ui-level');
const uiScore = document.getElementById('ui-score');
const uiKeys = document.getElementById('ui-keys');
const uiTime = document.getElementById('ui-time');
const consoleEl = document.getElementById('console');
const puzzleCount = document.getElementById('puzzle-count');

const modal = document.getElementById('modal');
const puzzleCode = document.getElementById('puzzleCode');
const puzzleAnswer = document.getElementById('puzzleAnswer');
const puzzleSubmit = document.getElementById('puzzleSubmit');
const puzzleHintText = document.getElementById('puzzleHintText');
const puzzlePenalty = document.getElementById('puzzlePenalty');

let boardCells = []; 
let timerInterval = null;





function log(msg, type='info'){
  const d = document.createElement('div'); d.innerHTML = msg;
  if(type==='pass') d.className='log-pass'; if(type==='fail') d.className='log-fail';
  consoleEl.appendChild(d); consoleEl.scrollTop = consoleEl.scrollHeight;
}
function startTimer(){
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(()=>{ state.time++; uiTime.textContent = state.time + 's'; }, 1000);
}
function stopTimer(){ if(timerInterval) clearInterval(timerInterval); timerInterval=null; }


function saveProgress() {
  const saveData = {
    levelIndex: state.levelIndex,
    player: state.player,
    keys: state.keys,
    score: state.score,
    time: state.time,
    solved: state.solved,
    lockedUntilSolved: state.lockedUntilSolved,
    levelsMap: levels.map(lvl => lvl.map.map(row => row.slice()))
  };
  localStorage.setItem('loopingDungeonSave', JSON.stringify(saveData));
}

function loadProgress() {
  const saved = localStorage.getItem('loopingDungeonSave');
  if (!saved) return false;
  try {
    const data = JSON.parse(saved);
    if (data.levelIndex !== undefined) {
      state.levelIndex = data.levelIndex;
      state.player = data.player;
      state.keys = data.keys;
      state.score = data.score;
      state.time = data.time;
      state.solved = data.solved;
      state.lockedUntilSolved = data.lockedUntilSolved || false;
      if (data.levelsMap && data.levelsMap.length === levels.length) {
        for (let i = 0; i < levels.length; i++) {
          levels[i].map = data.levelsMap[i];
        }
      }
      return true;
    }
  } catch (e) {
    console.error('Failed to load saved progress', e);
  }
  return false;
}




function loadLevel(idx, fromSave = false){
  stopTimer();
  state.levelIndex = idx;


  levels[idx].map = originalMaps[idx].slice();

  if (!fromSave) {
    state.keys = 0;
    state.time = 0;
    state.solved = {};
   
    const lvl = levels[idx];
    for(let r=0;r<lvl.rows;r++){
      for(let c=0;c<lvl.cols;c++){
        if(lvl.map[r][c]==='.' ){
          state.player = {r,c};
          break;
        }
      }
    }
  }

  
  const lvl = levels[idx];
  for (const p of lvl.puzzles) {
    const [r,c] = p.pos;
    if (state.solved > 0) {
      lvl.map[r] = replaceAt(lvl.map[r], c, '.');
    }
  }

  if(state.keys > 0){
    for(let r=0; r<lvl.rows; r++){
      for(let c=0; c<lvl.cols; c++){
        if(lvl.map[r][c] === 'K'){
          lvl.map[r] = replaceAt(lvl.map[r], c, '.');
        }
      }
    }
  }

  uiTime.textContent = state.time + 's';
  uiLevel.textContent = (idx+1) + ' — ' + lvl.name;
  uiScore.textContent = state.score;
  uiKeys.textContent = state.keys;
  puzzleCount.textContent = `Puzzles solved: ${state.solved}`;
  renderBoard(lvl);
  placePlayer();
  log(`<b>Entered:</b> ${lvl.name}`);
  startTimer();
}




function renderBoard(lvl){
  boardWrap.innerHTML = '';
  boardCells = [];
  const table = document.createElement('div');
  table.style.display = 'inline-block';

  for(let r=0;r<lvl.rows;r++){
    const rowDiv = document.createElement('div'); rowDiv.className='row';
    boardCells[r]=[];
    const line = lvl.map[r];
    for(let c=0;c<lvl.cols;c++){
      const ch = line[c];
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = r; cell.dataset.c = c;
      if(ch==='W'){ cell.classList.add('wall'); cell.textContent=''; }
      else if(ch==='.'){ cell.classList.add('floor'); cell.textContent=''; }
      else if(ch==='B'){ cell.classList.add('bug'); cell.textContent='🐞'; }
      else if(ch==='K'){ cell.classList.add('key'); cell.textContent='🔑'; }
      else if(ch==='G'){ cell.classList.add('goal'); cell.textContent='🔒'; }
      rowDiv.appendChild(cell);
      boardCells[r][c] = cell;
    }
    table.appendChild(rowDiv);
  }
  boardWrap.appendChild(table);


  for(let r=0;r<lvl.rows;r++){
    for(let c=0;c<lvl.cols;c++){
      if(lvl.map[r][c]==='.' ){ state.player = {r,c}; placePlayer(); return; }
    }
  }
}


function placePlayer(){
  
  document.querySelectorAll('.player').forEach(p=>p.remove());
  const {r,c} = state.player;
  const target = boardCells[r][c];
  const p = document.createElement('div'); p.className='player'; p.textContent='P';
  target.appendChild(p);
}



function tryMove(dr, dc) {
  const lvl = levels[state.levelIndex];
  const pr = state.player.r, pc = state.player.c;
  const nr = pr + dr, nc = pc + dc;

  if (nr < 0 || nc < 0 || nr >= lvl.rows || nc >= lvl.cols) return;

  const currentTile = lvl.map[pr][pc];
  const nextTile = lvl.map[nr][nc];
  const currentPos = `${pr},${pc}`;
  const trap = levels[state.levelIndex].bugTraps?.[currentPos];

  
  if (trap) {
    if (trap.blockDown && dr === 1 && dc === 0) {
      log("You can't move down until you solve the bug!", "fail");
      return;
    }
    if (trap.blockRight && dr === 0 && dc === 1) {
      log("You can't move right until you solve the bug!", "fail");
      return;
    }
  }

 
  if (nextTile === 'W') return;

  
  state.player.r = nr;
  state.player.c = nc;
  placePlayer();
  saveProgress();

  
  if (nextTile === 'B' && !isPuzzleSolved(nr, nc)) {
    openPuzzleAt(nr, nc);
  }

  if (nextTile === 'K') pickKey(nr, nc);
  if (nextTile === 'G') attemptRescue(nr, nc);
}

function isPuzzleSolved(r, c) {
  return state.solved?.[`${r},${c}`] === true;
}


function markPuzzleSolved(r, c) {
  const pos = `${r},${c}`;
  state.solved[pos] = true;
  const lvl = levels[state.levelIndex];
  lvl.map[r] = replaceAt(lvl.map[r], c, '.'); // replace bug with floor

  // Remove trap from current level's bugTraps
  if (lvl.bugTraps && lvl.bugTraps[pos]) {
    delete lvl.bugTraps[pos];
  }

  // Update the board cell visually
  if (boardCells[r] && boardCells[r][c]) {
    const cell = boardCells[r][c];
    cell.className = 'cell floor';
    cell.textContent = '';
  }

  saveProgress();
  closeModal();
  log("Bug disarmed! You may now move.", "pass");
}


function pickKey(r,c){
  const lvl = levels[state.levelIndex];
 
  if(lvl.map[r][c] === 'K'){
    lvl.map[r] = replaceAt(lvl.map[r], c, '.');
    boardCells[r][c].className='cell floor';
    boardCells[r][c].textContent='';
    state.keys++;
    uiKeys.textContent = state.keys;
    state.score += 50;
    uiScore.textContent = state.score;
    log('You picked up a key! +50 points', 'pass');
    saveProgress();
  }
}


function attemptRescue(r,c){
  const lvl = levels[state.levelIndex];
  if(lvl.map[r][c] === 'G'){
    if(state.keys > 0){
      
      state.keys--;
      uiKeys.textContent = state.keys;
      lvl.map[r] = replaceAt(lvl.map[r], c, '.');
      boardCells[r][c].className='cell floor';
      boardCells[r][c].textContent='';
      state.score += 200;
      uiScore.textContent = state.score;
      log('You rescued the captured variable! +200 points', 'pass');
      saveProgress();
      setTimeout(()=>{ state.levelIndex++; if(state.levelIndex < levels.length) loadLevel(state.levelIndex); else winGame(); }, 800);
    } else {
      log('The captured variable is locked inside — you need a key to free it.', 'fail');
    }
  }
}

function winGame(){
  stopTimer();
  log(`<b>All dungeons cleared!</b> Final score: ${state.score} — time: ${state.time}s`, 'pass');
  alert(`You rescued all variables!\nScore: ${state.score}\nTime: ${state.time}s`);
}


function replaceAt(s,i,c){ return s.slice(0,i) + c + s.slice(i+1); }


let currentPuzzle = null;
function openPuzzleAt(r,c){
  const lvl = levels[state.levelIndex];
 
  const p = lvl.puzzles.find(x => x.pos[0]===r && x.pos[1]===c);
  if(!p){ log('This trap is inert.'); return; }
  currentPuzzle = {lvlIndex: state.levelIndex, puzzle:p};
  
  puzzleCode.textContent = p.code;
  puzzleAnswer.value = '';
  puzzleHintText.textContent = 'Hints available: 1 (use console hint button)';
  puzzlePenalty.textContent = ''; 
  puzzlePenalty.style.color = "";  
  document.getElementById('modal').style.display = 'flex';
  puzzleAnswer.focus();
}




function closeModal(){ document.getElementById('modal').style.display = 'none'; }



puzzleSubmit.addEventListener('click', ()=>{
  const txt = puzzleAnswer.value.trim();
  if(!txt) return;
  const p = currentPuzzle.puzzle;
  const ok = checkPuzzleAnswer(txt, p.answers);
  if(ok){
    const [r,c] = p.pos;
    const lvl = levels[currentPuzzle.lvlIndex];
    
    markPuzzleSolved(r, c);
    
    const solvedCount = Object.keys(state.solved).length;
    puzzleCount.textContent = `Puzzles solved: ${solvedCount}`;
    state.score += 100;
    uiScore.textContent = state.score;
    log(`Puzzle solved! +100 points — (${p.answers.join(' / ')})`, 'pass');
    puzzlePenalty.textContent = "Correct! Bug disarmed.";
    puzzlePenalty.style.color = "limegreen";  
  } else {
    state.score = Math.max(0, state.score-10);
    uiScore.textContent = state.score;
    log('Incorrect fix. -10 points. Try again or use a hint.', 'fail');
    puzzlePenalty.textContent = "Incorrect fix. -10 points. Try again or use a hint.";
    puzzlePenalty.style.color = "red"; 
  }
});



function checkPuzzleAnswer(user, answers){
  const u = normalize(user);
  for(const a of answers){
    if(a.includes('|')){
      const parts = a.split('|').map(s=>normalize(s));
    
      const uParts = user.split('|').map(s=>normalize(s));
      const allPresent = parts.every(pp => u.includes(pp) || uParts.some(up => up.includes(pp)));
      if(allPresent) return true;
    } else {
      const aa = normalize(a);
      if(u === aa || u.includes(aa) || aa.includes(u)) return true;
    }
  }
  return false;
}
function normalize(s){ return s.replace(/\s+/g,' ').replace(/['"]/g,'"').trim(); }


document.getElementById('hintBtn').addEventListener('click', ()=>{
  if(state.score < 20){
    log('No more points to use hints.', 'fail');
    puzzlePenalty.textContent = "No more points to use hints.";
    puzzlePenalty.style.color = "red";
    return;
  }
  
  const lvl = levels[state.levelIndex];
  const p = lvl.puzzles.find(pp => {
    const [r,c] = pp.pos;
    return lvl.map[r][c] === 'B';
  });
  if(!p){ 
    log('No unsolved puzzles on this level.', 'info'); 
    puzzlePenalty.textContent = "No unsolved puzzles on this level.";
    puzzlePenalty.style.color = "red";
    return; 
  }
  state.score = Math.max(0, state.score - 20);
  uiScore.textContent = state.score;
  log(`Hint: ${p.hint} (-20 points)`, 'info');
  puzzlePenalty.textContent = `Hint: ${p.hint} (-20 points)`;
  puzzlePenalty.style.color = "limegreen";
  saveProgress();
});




window.addEventListener('keydown', (e)=>{
  const k = e.key.toLowerCase();
  if(document.getElementById('modal').style.display === 'flex'){
    if(k === 'enter') { puzzleSubmit.click(); }
    if(k === 'escape') closeModal();
    return;
  }
  if(['arrowup','w'].includes(e.key.toLowerCase())) { tryMove(-1,0); e.preventDefault(); }
  if(['arrowdown','s'].includes(e.key.toLowerCase())) { tryMove(1,0); e.preventDefault(); }
  if(['arrowleft','a'].includes(e.key.toLowerCase())) { tryMove(0,-1); e.preventDefault(); }
  if(['arrowright','d'].includes(e.key.toLowerCase())) { tryMove(0,1); e.preventDefault(); }
  if(k === 'enter'){ 
    const lvl = levels[state.levelIndex];
    const {r,c} = state.player;
    const ch = lvl.map[r][c];
    if(ch === 'B') openPuzzleAt(r,c);
    if(ch === 'K') pickKey(r,c);
    if(ch === 'G') attemptRescue(r,c);
  }
});


document.getElementById('restartBtn').addEventListener('click', ()=>{
  if(confirm('Restart level? This will reset all progress and start from Level 1.')) {
    localStorage.removeItem('loopingDungeonSave'); 
    location.reload();
  }
});




function closeModal(){ document.getElementById('modal').style.display='none'; }
function openModal(){ document.getElementById('modal').style.display='flex'; }


if (!loadProgress()) {
  loadLevel(0);
} else {
  loadLevel(state.levelIndex, true);
  log('Loaded saved progress.');
}
