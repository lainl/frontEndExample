document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = './html/index.html';
    }
  });
  