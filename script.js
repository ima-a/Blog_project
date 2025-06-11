if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    // User Authentication
    function registerUser(username, password) {
        if (!validateUsername(username) || !validatePassword(password)) {
            return false;
        }
        let users = JSON.parse(localStorage.getItem("users") || "[]");
        if (users.find(user => user.username === username)) {
            alert("Username already exists!");
            return false;
        }
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registration successful! Please log in.");
        return true;
    }

    function loginUser(username, password) {
        if (!validateUsername(username) || !validatePassword(password)) {
            return false;
        }
        let users = JSON.parse(localStorage.getItem("users") || "[]");
        let user = users.find(user => user.username === username && user.password === password);
        if (user) {
            localStorage.setItem("currentUser", username);
            alert(`Welcome, ${username}!`);
            window.location.href = "home.html";
            return true;
        } else {
            alert("Invalid username or password!");
            return false;
        }
    }

    function logoutUser() {
        localStorage.removeItem("currentUser");
        alert("Logged out successfully!");
        window.location.href = "home.html";
    }

    function isLoggedIn() {
        return !!localStorage.getItem("currentUser");
    }

    // Form Validations
    function validateUsername(username) {
        if (!username || username.trim().length < 3) {
            alert("Username must be at least 3 characters long!");
            return false;
        }
        return true;
    }

    function validatePassword(password) {
        if (!password || password.length < 6) {
            alert("Password must be at least 6 characters long!");
            return false;
        }
        return true;
    }

    function validateBlogForm(title, content) {
        if (!title || title.trim().length < 5) {
            alert("Blog title must be at least 5 characters long!");
            return false;
        }
        if (!content || content.trim().length < 20) {
            alert("Blog content must be at least 20 characters long!");
            return false;
        }
        return true;
    }

    // Blog Storage
    function createBlog(title, content) {
        if (!isLoggedIn()) {
            alert("Please log in to create a blog!");
            window.location.href = "login.html";
            return;
        }
        if (!validateBlogForm(title, content)) {
            return;
        }
        let blogs = JSON.parse(localStorage.getItem("blogs") || "[]");
        blogs.push({
            title,
            content,
            author: localStorage.getItem("currentUser"),
            date: new Date().toISOString().split("T")[0]
        });
        localStorage.setItem("blogs", JSON.stringify(blogs));
        alert("Blog created successfully!");
        window.location.href = "profile.html";
    }

    // Display Blogs in Profile
    function displayUserBlogs() {
        const blogList = document.getElementById("user-blogs");
        if (!blogList) return;
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
            blogList.innerHTML = "<p>Please log in to view your blogs.</p>";
            return;
        }
        let blogs = JSON.parse(localStorage.getItem("blogs") || "[]");
        const userBlogs = blogs.filter(blog => blog.author === currentUser);
        if (userBlogs.length === 0) {
            blogList.innerHTML = "<p>You haven't posted any blogs yet.</p>";
            return;
        }
        blogList.innerHTML = userBlogs.map(blog => `
            <div class="blog-post">
                <h4>${blog.title}</h4>
                <p>Posted on ${blog.date}</p>
                <p>${blog.content}</p>
            </div>
        `).join("");
    }

    // Event Listeners
    document.addEventListener("DOMContentLoaded", () => {
        // Card Click Enhancements
        const cards = document.querySelectorAll("section div a");
        cards.forEach(card => {
            card.addEventListener("click", (e) => {
                if ((card.getAttribute("href") === "profile.html" || card.getAttribute("href") === "create-blog.html") && !isLoggedIn()) {
                    e.preventDefault();
                    alert("Please log in to access this page!");
                    window.location.href = "login.html";
                }
                card.style.backgroundColor = "#e0e0e0";
                setTimeout(() => {
                    card.style.backgroundColor = "";
                }, 200);
            });
        });

        // Login Form
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const username = document.getElementById("username").value;
                const password = document.getElementById("password").value;
                loginUser(username, password);
            });
        }

        // Register Form (if added later)
        const registerForm = document.getElementById("register-form");
        if (registerForm) {
            registerForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const username = document.getElementById("username").value;
                const password = document.getElementById("password").value;
                if (registerUser(username, password)) {
                    window.location.href = "login.html";
                }
            });
        }

        // Blog Creation Form
        const blogForm = document.getElementById("blog-form");
        if (blogForm) {
            blogForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const title = document.getElementById("blog-title").value;
                const content = document.getElementById("blog-content").value;
                createBlog(title, content);
            });
        }

        // Update Login/Logout in Nav
        const loginLink = document.querySelector("nav a[href='login.html']");
        if (loginLink) {
            if (isLoggedIn()) {
                loginLink.textContent = "Logout";
                loginLink.href = "#";
                loginLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    logoutUser();
                });
            }
        }

        // Display Username and Blogs in Profile
        const profileUsername = document.getElementById("profile-username");
        if (profileUsername) {
            const currentUser = localStorage.getItem("currentUser");
            profileUsername.textContent = currentUser ? currentUser : "Guest";
        }
        displayUserBlogs();
    });
}