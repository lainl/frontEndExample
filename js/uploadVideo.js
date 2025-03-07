document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const messageDiv = document.getElementById('message');
  
    uploadForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      messageDiv.textContent = '';
  
      const videoFile = document.getElementById('videoFile').files[0];
      const videoTitle = document.getElementById('videoTitle').value;
      const userId = localStorage.getItem('userid'); 
  
      if (!videoFile) {
        messageDiv.textContent = 'Please select a video file.';
        return;
      }
      if (!userId) {
        messageDiv.textContent = 'No user ID found. Please log in again.';
        return;
      }
  

      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('userId', userId);
  
      if (videoTitle.trim() !== '') {
        formData.append('title', videoTitle.trim());
      }
  
      try {
        const response = await fetch('http://localhost:3000/video/upload', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          
          alert('Video uploaded successfully!');
          window.location.href = './html/index.html';
        } else {
          const errorData = await response.json();
          messageDiv.textContent = errorData.error || 'Upload failed';
        }
      } catch (error) {
        console.error('Error uploading video:', error);
        messageDiv.textContent = 'An unexpected error occurred. Please try again.';
      }
    });
  });
  