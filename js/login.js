
const LOGIN_ENDPOINT = 'http://localhost:3000/login';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const messageDiv = document.getElementById('message');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    messageDiv.textContent = '';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });


      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('userid', data.userid);

        messageDiv.style.color = 'green';
        messageDiv.textContent = data.message || 'Login successful!';
        
        setTimeout(() => {
          window.location.href = './html/home.html';
        }, 1000);
      } else {
        const errorData = await response.json();
        messageDiv.textContent = errorData.error || 'Login failed';
      }
    } catch (error) {
      messageDiv.textContent = 'An unexpected error occurred. Please try again.';
      console.error('Error during login:', error);
    }
  });
});
