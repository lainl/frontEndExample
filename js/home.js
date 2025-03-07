const USER_ENDPOINT = 'http://localhost:3000/user';
const LOGOUT_ENDPOINT = 'http://localhost:3000/logout';

document.addEventListener('DOMContentLoaded', async () => {
  const userInfoDiv = document.getElementById('userInfo');
  const videosDiv = document.getElementById('videos');
  const logoutButton = document.getElementById('logoutButton');

  const userid = localStorage.getItem('userid');
  try {
    const userResponse = await fetch(`${USER_ENDPOINT}/${userid}`);
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await userResponse.json();
    
    userInfoDiv.innerHTML = `
      <p><strong>Username:</strong> ${userData.username}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
    `;

    if (Array.isArray(userData.videoIds) && userData.videoIds.length > 0) {
      videosDiv.innerHTML = '<h2>Your Videos</h2>';

      for (const videoId of userData.videoIds) {
        try {
          const videoResponse = await fetch(`http://localhost:3000/video/${videoId}`);
          if (videoResponse.ok) {
            const videoData = await videoResponse.json();
            const videoLink = document.createElement('a');
            videoLink.href = `../html/watchVideo.html?videoId=${videoData._id}`;
            videoLink.textContent = videoData.title || 'Untitled Video';
            videoLink.style.display = 'block';
            videosDiv.appendChild(videoLink);
          } else {
            console.error(`Failed to fetch video with id: ${videoId}`);
          }
        } catch (videoError) {
          console.error('Error fetching video:', videoError);
        }
      }
    } else {
      videosDiv.innerHTML = '<p>You have not uploaded any videos yet.</p>';
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    userInfoDiv.textContent = 'Error loading user data.';
  }

  logoutButton.addEventListener('click', async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      const response = await fetch(LOGOUT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken })
      });

      if (response.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userid');
        window.location.href = './html/index.html';
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('An error occurred while logging out. Please try again.');
    }
  });
});
