 window.onload = function () {
    // Load profile image
    const savedImage = localStorage.getItem("profile");
    if (savedImage) {
      document.getElementById("set-pfp").src = savedImage;
    }
    //DEBUGGING
    // Load debugging progress
    const debugCompleted = parseInt(localStorage.getItem("debuggingQuests")) || 0;
    const dxp = parseInt(localStorage.getItem("debuggingXP")) || 0;
    const totaldebugQuests = 3;
    // Update quests completed text
    const debugQuestsElem = document.getElementById("debugQuests");
    if (debugQuestsElem) {
      debugQuestsElem.textContent = `${debugCompleted}/${totaldebugQuests} quests completed`;
    }
    // Update XP text
    const debugXPElem = document.getElementById("debugXP");
    if (debugXPElem) {
      debugXPElem.textContent = `${dxp} XP`;
    }
    // Update progress bar width
    const debugProgressBar = document.getElementById("debugProgressBar");
    if (debugProgressBar) {
      const progressPercent = Math.min((debugCompleted / totaldebugQuests) * 100, 100);
      debugProgressBar.style.width = progressPercent + "%";
    }
    // Update XP counter in nav
    const dxpCounter = document.getElementById("xp-counter");
    if (dxpCounter) {
      dxpCounter.textContent = dxp + " XP";
    }
    //LOOPING
    //Load loop progress
    const loopCompleted = parseInt(localStorage.getItem("loopingQuests")) || 0;
    const lxp = parseInt(localStorage.getItem("loopXP")) || 0;
    const totaloopQuests = 3;
    //update quests completed text
    const loopQuestsElem = document.getElementById("loopQuests");
    if (loopQuestsElem) {
      loopQuestsElem.textContent = `${loopCompleted}/${totaloopQuests} quests completed`;
    }
    //update XP text
    const loopXPElem = document.getElementById("loopXP");
    if (loopXPElem) {
      loopXPElem.textContent = `${lxp} XP`;
    }
    //Update progress bar width
    const loopProgressBar = document.getElementById("loopProgressBar");
    if (loopProgressBar){
      const progressPercent = Math.min((loopCompleted / totaloopQuests)* 100, 100);
      loopProgressBar.style.width = progressPercent + "%";
    }
    //Update XP counter in nav
    const lxpCounter = document.getElementById("xp-counter");
    if(lxpCounter){
      lxpCounter.textContent = dxp + "XP";
    }
    
  };
