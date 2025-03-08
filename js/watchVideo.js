document.addEventListener('DOMContentLoaded', async () => {
  const videoInfoDiv = document.getElementById('videoInfo');
  const videoPlayer = document.getElementById('videoPlayer');
  const backButton = document.getElementById('backButton');

  const params = new URLSearchParams(window.location.search);
  const videoId = params.get('videoId');

  if (!videoId) {
    console.error('No videoId found in query params.');
    videoInfoDiv.textContent = 'No video ID provided.';
    return;
  }

  try {
    const metadataUrl = `https://vidbox-backend-7u1k.onrender.com/video/${videoId}`;
    console.log(`Fetching video metadata from: ${metadataUrl}`);

    const response = await fetch(metadataUrl);
    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch video metadata (status: ${response.status})`);
    }

    const videoData = await response.json();
    console.log('videoData from server:', videoData);

    videoInfoDiv.innerHTML = `<h2>${videoData.title || 'Untitled Video'}</h2>`;

    const streamUrl = `https://vidbox-backend-7u1k.onrender.com/video/stream/${videoId}`;
    console.log(`Constructed stream URL: ${streamUrl}`);

    videoPlayer.src = streamUrl;

    videoPlayer.addEventListener('loadedmetadata', () => {
      console.log('Video metadata loaded successfully.');
    });

    videoPlayer.addEventListener('error', (e) => {
      console.error('Video player error event:', e);
    });

  } catch (error) {
    console.error('Error fetching or setting video metadata:', error);
    videoInfoDiv.textContent = 'Error loading video.';
  }

  backButton.addEventListener('click', () => {
    window.location.href = './html/home.html';
  });
});
