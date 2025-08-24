const feed = document.getElementById('video-feed');

// Sample video data (replace with API later)
const videos = [
  { src: 'videos/video1.mp4', likes: 0, comments: [] },
  { src: 'videos/video2.mp4', likes: 0, comments: [] },
  { src: 'videos/video3.mp4', likes: 0, comments: [] },
];

function createVideoCard(video) {
  const container = document.createElement('div');
  container.className = 'video-container';

  const vid = document.createElement('video');
  vid.src = video.src;
  vid.controls = true;
  vid.loop = true;
  vid.autoplay = true;
  vid.muted = true;
  container.appendChild(vid);

  const actions = document.createElement('div');
  actions.className = 'actions';

  const likeBtn = document.createElement('button');
  likeBtn.textContent = `❤️ ${video.likes}`;
  likeBtn.onclick = () => { video.likes++; likeBtn.textContent = `❤️ ${video.likes}`; };
  
  const shareBtn = document.createElement('button');
  shareBtn.textContent = '🔗';
  shareBtn.onclick = () => {
    if (navigator.share) {
      navigator.share({ title: 'Check this video!', url: window.location.href });
    } else {
      alert('Share not supported');
    }
  };

  actions.appendChild(likeBtn);
  actions.appendChild(shareBtn);
  container.appendChild(actions);

  return container;
}

// Load videos into feed
videos.forEach(v => feed.appendChild(createVideoCard(v)));
