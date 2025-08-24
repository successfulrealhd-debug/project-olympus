const feed = document.getElementById("feed");
const uploadBtn = document.getElementById("uploadBtn");
const videoUpload = document.getElementById("videoUpload");
const shareBtn = document.getElementById("shareBtn");

// Sample demo feed
const demoVideos = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4"
];

function loadFeed() {
  feed.innerHTML = "";
  demoVideos.forEach(src => {
    const vid = document.createElement("video");
    vid.src = src;
    vid.controls = true;
    vid.loop = true;
    feed.appendChild(vid);
  });
}

// Upload video
uploadBtn.addEventListener("click", () => {
  videoUpload.click();
});

videoUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    demoVideos.unshift(url);
    loadFeed();
  }
});

// Share app
shareBtn.addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "OlympusTok",
        text: "Check out OlympusTok – the new TikTok clone!",
        url: window.location.href
      });
    } catch (err) {
      console.log("Share failed", err);
    }
  } else {
    alert("Share not supported on this browser.");
  }
});

// Init
loadFeed();
