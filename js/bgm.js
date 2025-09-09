// bgm.js
document.addEventListener("DOMContentLoaded", () => {
  const bgm = new Audio("assets/audio/bgm.mp3");
  bgm.loop = true;
  bgm.volume = 0.5;

  // Try autoplay
  bgm.play().catch(() => {
    console.log("Autoplay blocked. Waiting for user interaction...");
    // Resume once user clicks anywhere
    document.body.addEventListener("click", () => {
      bgm.play();
    }, { once: true });
  });
});
