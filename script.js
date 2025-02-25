const API_URL = "https://vidbox-backend-7u1k.onrender.com";


document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch(`${API_URL}login`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (error) {
            console.error("Invalid JSON response:", text);
            return;
        }

        if (!response.ok) {
            document.getElementById("errorMessage").textContent = data.error || "Login failed.";
            return;
        }

        if (!data.accessToken) {
            console.error("Missing accessToken in response:", data);
            return;
        }

        localStorage.setItem("accessToken", data.accessToken);
        window.location.href = "testAuthPage.html";
    } catch (error) {
        console.error("Login error:", error);
    }
});


async function checkAuth() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}testAuthPage`, { 
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            localStorage.removeItem("accessToken");
            window.location.href = "index.html";
            return;
        }

        const data = await response.json();
        document.getElementById("welcomeMessage").textContent = data.message;
    } catch (error) {
        console.error("Auth check error:", error);
        window.location.href = "index.html";
    }
}

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
        await fetch(`${API_URL}logout`, { 
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        localStorage.removeItem("accessToken");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Logout error:", error);
    }
});
