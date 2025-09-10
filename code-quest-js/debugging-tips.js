
  function releaseSideEmojis() {
    const emojis = ["🛠", "🐞"];
    const left = document.getElementById("emoji-left");
    const right = document.getElementById("emoji-right");

    emojis.forEach(symbol => {
      [left, right].forEach(container => {
        const emoji = document.createElement("div");
        emoji.className = "floating-emoji";
        emoji.innerText = symbol;

        // Random horizontal position within the side zone
        emoji.style.left = Math.random() * container.offsetWidth + "px";

        container.appendChild(emoji);

        setTimeout(() => {
          container.removeChild(emoji);
        }, 3000);
      });
    });
  }

  window.onload = () => {
    setInterval(releaseSideEmojis, 500);
  };