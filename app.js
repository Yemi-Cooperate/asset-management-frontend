const app = document.getElementById("app");
const API_BASE = "#"; // update this after deployment

const renderLogin = () => {
  app.innerHTML = `
    <div class="container">
      <h2>Login</h2>
      <form id="loginForm">
        <input type="email" placeholder="Email" id="email" class="input" required />
        <input type="password" placeholder="Password" id="password" class="input" required />
        <button type="submit" class="btn">Login</button>
        <p style="margin-top:1rem;">Don't have an account? <a href="#" onclick="renderRegister()">Register</a></p>
      </form>
    </div>
  `;

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        renderDashboard();
      } else {
        alert("Login failed");
      }
    } catch {
      alert("Server error");
    }
  });
};

const renderRegister = () => {
  app.innerHTML = `
    <div class="container">
      <h2>Register</h2>
      <form id="registerForm">
        <input type="email" placeholder="Email" id="regEmail" class="input" required />
        <input type="password" placeholder="Password" id="regPassword" class="input" required />
        <button type="submit" class="btn">Register</button>
        <p style="margin-top:1rem;">Already have an account? <a href="#" onclick="renderLogin()">Login</a></p>
      </form>
    </div>
  `;

  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 201) {
        alert("Registration successful. Please login.");
        renderLogin();
      } else {
        alert("Registration failed");
      }
    } catch {
      alert("Server error");
    }
  });
};

const renderDashboard = async () => {
  const token = localStorage.getItem("token");
  if (!token) return renderLogin();

  const res = await fetch(`${API_BASE}/api/assets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const assets = await res.json();

  app.innerHTML = `
    <div class="container">
      <h2>Dashboard</h2>
      <button class="btn" onclick="renderAssetForm()">Add Asset</button>
      <button class="btn" onclick="logout()" style="margin-top: 1rem; background-color: #ef4444;">Logout</button>
      <table style="width:100%; margin-top:1rem; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          ${assets
            .map(
              (a) => `
                <tr>
                  <td>${a.name}</td>
                  <td>${a.type}</td>
                  <td>${a.assignedTo || "Unassigned"}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
};

const renderAssetForm = () => {
  app.innerHTML = `
    <div class="container">
      <h2>Add Asset</h2>
      <form id="assetForm">
        <input type="text" id="name" placeholder="Asset Name" class="input" required />
        <input type="text" id="type" placeholder="Type (Hardware/Software)" class="input" required />
        <input type="text" id="assignedTo" placeholder="Assigned To" class="input" />
        <button type="submit" class="btn">Save</button>
        <button class="btn" type="button" onclick="renderDashboard()" style="margin-top: 1rem; background-color: #6b7280;">Cancel</button>
      </form>
    </div>
  `;

  document.getElementById("assetForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const asset = {
      name: document.getElementById("name").value,
      type: document.getElementById("type").value,
      assignedTo: document.getElementById("assignedTo").value,
    };

    await fetch(`${API_BASE}/api/assets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(asset),
    });
    renderDashboard();
  });
};

const logout = () => {
  localStorage.removeItem("token");
  renderLogin();
};

renderLogin();
