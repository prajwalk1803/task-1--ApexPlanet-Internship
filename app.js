// ===== NAV MENU =====
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

// Close menu on click
document.querySelectorAll(".nav a").forEach(a => {
  a.addEventListener("click", () => nav.classList.remove("open"));
});

// ===== THEME TOGGLE =====
const themeBtn = document.getElementById("themeBtn");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light");
  themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeBtn.textContent = isLight ? "☀️" : "🌙";
});

// ===== SKILLS RENDER =====
const skillsGrid = document.getElementById("skillsGrid");

skills.forEach(skill => {
  const div = document.createElement("div");
  div.className = "skill-card";
  div.innerHTML = `
    <div class="skill-top">
      <span>${skill.name}</span>
      <span>${skill.level}%</span>
    </div>
    <div class="bar">
      <div class="fill" style="width:${skill.level}%"></div>
    </div>
  `;
  skillsGrid.appendChild(div);
});

// ===== PROJECTS RENDER =====
const projectsGrid = document.getElementById("projectsGrid");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

function renderProjects(list) {
  projectsGrid.innerHTML = "";
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "card project";
    div.innerHTML = `
      <div class="badge">${p.category.toUpperCase()}</div>
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <div class="mini">
        ${p.tech.map(t => `<span class="tag">${t}</span>`).join("")}
      </div>
    `;

    div.addEventListener("click", () => {
      incrementAnalytics("projectsViewed", "Project clicked: " + p.title);
    });

    projectsGrid.appendChild(div);
  });
}

renderProjects(projects);

// Search + filter
function filterProjects() {
  const term = searchInput.value.toLowerCase();
  const cat = filterSelect.value;

  const filtered = projects.filter(p => {
    const matchesTerm =
      p.title.toLowerCase().includes(term) ||
      p.desc.toLowerCase().includes(term);

    const matchesCat = cat === "all" ? true : p.category === cat;

    return matchesTerm && matchesCat;
  });

  renderProjects(filtered);
}

searchInput.addEventListener("input", filterProjects);
filterSelect.addEventListener("change", filterProjects);

// ===== ANALYTICS (LocalStorage) =====
function getAnalytics() {
  return JSON.parse(localStorage.getItem("analytics") || "{}");
}

function saveAnalytics(data) {
  localStorage.setItem("analytics", JSON.stringify(data));
}

function incrementAnalytics(key, logMessage) {
  const data = getAnalytics();
  data[key] = (data[key] || 0) + 1;

  data.logs = data.logs || [];
  data.logs.unshift(new Date().toLocaleString() + " → " + logMessage);

  saveAnalytics(data);
  updateAnalyticsUI();
}

function updateAnalyticsUI() {
  const data = getAnalytics();

  document.getElementById("totalVisits").textContent = data.totalVisits || 0;
  document.getElementById("totalSubmits").textContent = data.totalSubmits || 0;
  document.getElementById("projectsViewed").textContent = data.projectsViewed || 0;

  document.getElementById("statVisitors").textContent = data.totalVisits || 0;

  const logBox = document.getElementById("activityLog");
  logBox.innerHTML = "";

  (data.logs || []).slice(0, 25).forEach(item => {
    const p = document.createElement("p");
    p.textContent = item;
    logBox.appendChild(p);
  });
}

// Visits increment on load
incrementAnalytics("totalVisits", "Website visited");

document.getElementById("resetAnalytics").addEventListener("click", () => {
  localStorage.removeItem("analytics");
  updateAnalyticsUI();
});

updateAnalyticsUI();

// ===== CONTACT FORM VALIDATION + PHP API CALL =====
const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMsg.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const category = document.getElementById("category").value;
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !password || !message) {
    formMsg.textContent = "❌ Please fill all required fields.";
    formMsg.style.color = "#fca5a5";
    return;
  }

  if (!isValidEmail(email)) {
    formMsg.textContent = "❌ Invalid email format.";
    formMsg.style.color = "#fca5a5";
    return;
  }

  if (password.length < 6) {
    formMsg.textContent = "❌ Password must be at least 6 characters.";
    formMsg.style.color = "#fca5a5";
    return;
  }

  const formData = new FormData(contactForm);

  try {
    const res = await fetch("api/save_message.php", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      formMsg.textContent = "✅ Message saved successfully!";
      formMsg.style.color = "#86efac";
      contactForm.reset();

      incrementAnalytics("totalSubmits", "Contact form submitted");
    } else {
      formMsg.textContent = "❌ " + (data.error || "Server error");
      formMsg.style.color = "#fca5a5";
    }
  } catch (err) {
    formMsg.textContent = "❌ API not running. Use XAMPP localhost.";
    formMsg.style.color = "#fca5a5";
  }
});
