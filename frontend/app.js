import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

const loginBtn = document.getElementById('login-btn');
const uploadBtn = document.getElementById('upload-btn');
const videoFeed = document.getElementById('video-feed');

loginBtn.onclick = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
  alert("Logged in successfully!");
};

uploadBtn.onclick = async () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'video/*';
  fileInput.onchange = async e => {
    const file = e.target.files[0];
    const storageRef = ref(storage, 'videos/' + file.name);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await addDoc(collection(db, "videos"), { url, likes: 0, comments: [], timestamp: Date.now() });
    loadVideos();
  };
  fileInput.click();
};

async function loadVideos() {
  videoFeed.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, "videos"));
  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';

    const video = document.createElement('video');
    video.src = data.url;
    video.autoplay = true;
    video.loop = true;
    video.muted = false;
    video.controls = false;

    // Pause video when out of view
    videoContainer.addEventListener('mouseenter', () => video.play());
    videoContainer.addEventListener('mouseleave', () => video.pause());

    const actions = document.createElement('div');
    actions.className = 'video-actions';

    const likeBtn = document.createElement('button');
    likeBtn.textContent = `❤️ ${data.likes}`;
    likeBtn.onclick = async () => {
      const docRef = doc(db, 'videos', docSnap.id);
      await updateDoc(docRef, { likes: data.likes + 1 });
      loadVideos();
    };

    const commentBtn = document.createElement('button');
    commentBtn.textContent = `💬 ${data.comments.length}`;
    commentBtn.onclick = async () => {
      const comment = prompt("Add a comment:");
      if(comment) {
        const docRef = doc(db, 'videos', docSnap.id);
        await updateDoc(docRef, { comments: [...data.comments, comment] });
        loadVideos();
      }
    };

    const shareBtn = document.createElement('button');
    shareBtn.textContent = '🔗';
    shareBtn.onclick = () => {
      navigator.clipboard.writeText(data.url);
      alert("Video URL copied to clipboard!");
    };

    actions.append(likeBtn, commentBtn, shareBtn);
    videoContainer.append(video, actions);
    videoFeed.appendChild(videoContainer);
  });

  // Autoplay first visible video
  const firstVideo = document.querySelector('.video-container video');
  if(firstVideo) firstVideo.play();
}

loadVideos();
