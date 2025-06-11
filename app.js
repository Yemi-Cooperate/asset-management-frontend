const app = document.getElementById("app");
const API_BASE = "https://asset-management-backend-1-l4ne.onrender.com"; // ← replace with your backend URL

const renderDashboard = async () => {
  const res = await fetch(`${API_BASE}/api/assets`);
  const assets = await res.json();

  app.innerHTML = `
    <div class="container">
      <h2>Asset Dashboard</h2>
      <button class="btn" onclick="renderAssetForm()">Add Asset</button>
      <table style="width:100%; margin-top:1rem; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          ${assets.map(a => `
            <tr>
              <td>${a.name}</td>
              <td>${a.type}</td>
              <td>${a.assignedTo || "Unassigned"}</td>
            </tr>
          `).join("")}
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
    const asset = {
      name: document.getElementById("name").value,
      type: document.getElementById("type").value,
      assignedTo: document.getElementById("assignedTo").value,
    };

    await fetch(`${API_BASE}/api/assets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asset),
    });

    renderDashboard();
  });
};

// Load dashboard on start
renderDashboard();
