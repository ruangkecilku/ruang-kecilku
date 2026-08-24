const KEYS = {
  foods: "ruangKecilku.foods",
  moods: "ruangKecilku.moods",
  stories: "ruangKecilku.stories"
};

const state = {
  page: "home",
  foods: load(KEYS.foods),
  moods: load(KEYS.moods),
  stories: load(KEYS.stories),
  selectedMood: ""
};

function load(key) {
  try {
    const raw = JSON.parse(localStorage.getItem(key));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function todayLocal() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function setDefaults() {
  document.getElementById("foodDate").value = todayLocal();
  document.getElementById("moodDate").value = todayLocal();
  document.getElementById("storyDate").value = todayLocal();
}

function setPage(page) {
  state.page = page;
  document.querySelectorAll(".page").forEach(section => {
    section.classList.toggle("active", section.id === `page-${page}`);
  });
  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function sortByDateDesc(items, field = "date") {
  return [...items].sort((a, b) => {
    return (b[field] || "").localeCompare(a[field] || "") || String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  });
}

function latest(items) {
  return sortByDateDesc(items)[0] || null;
}

function messageForHome() {
  const messages = [
    "Hari kecilmu tetap berarti, walau terasa sederhana.",
    "Pelan-pelan juga tetap langkah. Tidak perlu buru-buru.",
    "Simpan hal kecil yang hangat. Besok kamu bisa membacanya lagi.",
    "Kalau harimu ringan, nikmati. Kalau berat, istirahat juga boleh."
  ];
  const total = state.foods.length + state.moods.length + state.stories.length;
  return messages[total % messages.length];
}

function moodFaceClass(mood) {
  const map = {
    "Cerah": "happy",
    "Tenang": "calm",
    "Biasa": "neutral",
    "Lelah": "sleepy",
    "Mendung": "cloudy"
  };
  return map[mood] || "neutral";
}

function renderHome() {
  const lastFood = latest(state.foods);
  const lastMood = latest(state.moods);
  const lastStory = latest(state.stories);
  const total = state.foods.length + state.moods.length + state.stories.length;

  document.getElementById("homeFoodValue").textContent = lastFood ? lastFood.menu : "Belum ada";
  document.getElementById("homeFoodMeta").textContent = lastFood ? `${lastFood.meal} • ${lastFood.feeling}` : "Tambahkan catatan makan pertama.";

  document.getElementById("homeMoodValue").textContent = lastMood ? lastMood.mood : "Belum ada";
  document.getElementById("homeMoodMeta").textContent = lastMood ? (lastMood.note || `Dicatat pada ${formatDate(lastMood.date)}`) : "Mood akan tampil di sini.";

  document.getElementById("homeStoryValue").textContent = lastStory ? lastStory.title : "Belum ada";
  document.getElementById("homeStoryMeta").textContent = lastStory ? truncate(lastStory.highlight || lastStory.content, 60) : "Cerita harian terakhirmu.";

  document.getElementById("homeTotalValue").textContent = String(total);
  document.getElementById("homeTotalMeta").textContent = total ? `Ada ${state.foods.length} makan, ${state.moods.length} mood, dan ${state.stories.length} cerita.` : "Gabungan makan, mood, dan cerita.";
  document.getElementById("homeMessage").textContent = messageForHome();
}

function entryCard(content, withDeleteType, id) {
  return `
    <article class="entry-card">
      ${content}
      <div class="entry-actions">
        <button class="delete-btn" type="button" data-delete="${withDeleteType}" data-id="${id}">Hapus</button>
      </div>
    </article>
  `;
}

function renderFoods() {
  const list = document.getElementById("foodList");
  const foods = sortByDateDesc(state.foods);
  if (!foods.length) {
    list.innerHTML = '<div class="empty-state">Belum ada catatan makan. Coba simpan makanan pertama hari ini.</div>';
    return;
  }

  list.innerHTML = foods.map(item => entryCard(`
    <div class="entry-card-head">
      <div>
        <strong>${escapeHtml(item.menu)}</strong>
        <div class="entry-meta">${escapeHtml(item.meal)} • ${formatDate(item.date)}</div>
      </div>
      <span class="entry-tag">${escapeHtml(item.feeling)}</span>
    </div>
    <p>${escapeHtml(item.note || "Tidak ada catatan tambahan.")}</p>
  `, "food", item.id)).join("");
}

function renderMoods() {
  const list = document.getElementById("moodList");
  const moods = sortByDateDesc(state.moods);
  if (!moods.length) {
    list.innerHTML = '<div class="empty-state">Belum ada catatan mood. Pilih warna harimu lebih dulu.</div>';
    return;
  }

  list.innerHTML = moods.map(item => entryCard(`
    <div class="entry-card-head">
      <div>
        <strong>${escapeHtml(item.mood)}</strong>
        <div class="entry-meta">${formatDate(item.date)}</div>
      </div>
      <span class="piyo-face ${moodFaceClass(item.mood)}"></span>
    </div>
    <p>${escapeHtml(item.note || "Tidak ada catatan tambahan.")}</p>
  `, "mood", item.id)).join("");
}

function renderStories() {
  const list = document.getElementById("storyList");
  const stories = sortByDateDesc(state.stories);
  if (!stories.length) {
    list.innerHTML = '<div class="empty-state">Belum ada cerita. Tulis momen kecil yang ingin kamu simpan.</div>';
    return;
  }

  list.innerHTML = stories.map(item => entryCard(`
    <div class="entry-card-head">
      <div>
        <div class="entry-card-title">${escapeHtml(item.title)}</div>
        <div class="entry-meta">${formatDate(item.date)}</div>
      </div>
      ${item.highlight ? `<span class="entry-tag">${escapeHtml(item.highlight)}</span>` : ""}
    </div>
    <p>${escapeHtml(item.content)}</p>
  `, "story", item.id)).join("");
}

function countBy(items, field) {
  const map = new Map();
  items.forEach(item => {
    const key = item[field] || "";
    if (!key) return;
    map.set(key, (map.get(key) || 0) + 1);
  });
  const top = [...map.entries()].sort((a, b) => b[1] - a[1])[0];
  return top ? `${top[0]} (${top[1]})` : "Belum ada";
}

function activeDays() {
  const set = new Set();
  [...state.foods, ...state.moods, ...state.stories].forEach(item => {
    if (item.date) set.add(item.date);
  });
  return set;
}

function renderCollection() {
  document.getElementById("collectionFoodCount").textContent = String(state.foods.length);
  document.getElementById("collectionMoodCount").textContent = String(state.moods.length);
  document.getElementById("collectionStoryCount").textContent = String(state.stories.length);
  document.getElementById("collectionActiveDays").textContent = String(activeDays().size);
  document.getElementById("collectionTopMeal").textContent = countBy(state.foods, "meal");
  document.getElementById("collectionTopMood").textContent = countBy(state.moods, "mood");
  document.getElementById("collectionLatestTitle").textContent = latest(state.stories)?.title || "Belum ada";

  const dots = document.getElementById("activityDots");
  const active = activeDays();
  const last28 = [];
  for (let i = 27; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    last28.push(key);
  }
  dots.innerHTML = last28.map((date, index) => {
    const cls = active.has(date) ? (index % 2 === 0 ? "activity-dot active" : "activity-dot active soft") : "activity-dot";
    return `<span class="${cls}" title="${date}"></span>`;
  }).join("");

  const foodRecent = sortByDateDesc(state.foods).slice(0, 3);
  const storyRecent = sortByDateDesc(state.stories).slice(0, 3);

  document.getElementById("collectionFoodRecent").innerHTML = foodRecent.length
    ? foodRecent.map(item => `<article class="entry-card"><strong>${escapeHtml(item.menu)}</strong><p>${escapeHtml(item.meal)} • ${formatDate(item.date)}</p></article>`).join("")
    : '<div class="empty-state">Belum ada catatan makan.</div>';

  document.getElementById("collectionStoryRecent").innerHTML = storyRecent.length
    ? storyRecent.map(item => `<article class="entry-card"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(truncate(item.content, 90))}</p></article>`).join("")
    : '<div class="empty-state">Belum ada cerita.</div>';
}

function formatDate(value) {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function truncate(text, max = 70) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function renderAll() {
  renderHome();
  renderFoods();
  renderMoods();
  renderStories();
  renderCollection();
}

function clearFoodForm() {
  document.getElementById("foodDate").value = todayLocal();
  document.getElementById("foodMeal").value = "";
  document.getElementById("foodMenu").value = "";
  document.getElementById("foodFeeling").value = "";
  document.getElementById("foodNote").value = "";
}

function clearMoodForm() {
  document.getElementById("moodDate").value = todayLocal();
  document.getElementById("moodNote").value = "";
  document.getElementById("moodValue").value = "";
  state.selectedMood = "";
  document.querySelectorAll(".mood-choice").forEach(btn => btn.classList.remove("active"));
}

function clearStoryForm() {
  document.getElementById("storyDate").value = todayLocal();
  document.getElementById("storyTitle").value = "";
  document.getElementById("storyContent").value = "";
  document.getElementById("storyHighlight").value = "";
}

function setupEvents() {
  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => setPage(button.dataset.page));
  });

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => setPage(button.dataset.go));
  });

  document.getElementById("foodForm").addEventListener("submit", event => {
    event.preventDefault();
    const item = {
      id: uid(),
      date: document.getElementById("foodDate").value,
      meal: document.getElementById("foodMeal").value,
      menu: document.getElementById("foodMenu").value.trim(),
      feeling: document.getElementById("foodFeeling").value,
      note: document.getElementById("foodNote").value.trim(),
      createdAt: new Date().toISOString()
    };
    state.foods.unshift(item);
    save(KEYS.foods, state.foods);
    clearFoodForm();
    renderAll();
    showToast("Catatan makan tersimpan.");
    setPage("food");
  });

  document.querySelectorAll(".mood-choice").forEach(button => {
    button.addEventListener("click", () => {
      state.selectedMood = button.dataset.mood;
      document.getElementById("moodValue").value = state.selectedMood;
      document.querySelectorAll(".mood-choice").forEach(btn => btn.classList.toggle("active", btn === button));
    });
  });

  document.getElementById("moodForm").addEventListener("submit", event => {
    event.preventDefault();
    const mood = document.getElementById("moodValue").value;
    if (!mood) {
      showToast("Pilih mood dulu ya.");
      return;
    }
    const item = {
      id: uid(),
      date: document.getElementById("moodDate").value,
      mood,
      note: document.getElementById("moodNote").value.trim(),
      createdAt: new Date().toISOString()
    };
    state.moods.unshift(item);
    save(KEYS.moods, state.moods);
    clearMoodForm();
    renderAll();
    showToast("Mood tersimpan.");
    setPage("mood");
  });

  document.getElementById("storyForm").addEventListener("submit", event => {
    event.preventDefault();
    const item = {
      id: uid(),
      date: document.getElementById("storyDate").value,
      title: document.getElementById("storyTitle").value.trim(),
      content: document.getElementById("storyContent").value.trim(),
      highlight: document.getElementById("storyHighlight").value.trim(),
      createdAt: new Date().toISOString()
    };
    state.stories.unshift(item);
    save(KEYS.stories, state.stories);
    clearStoryForm();
    renderAll();
    showToast("Cerita tersimpan.");
    setPage("story");
  });

  document.body.addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;
    const type = button.dataset.delete;
    const id = button.dataset.id;
    if (!confirm("Hapus catatan ini?")) return;
    if (type === "food") state.foods = state.foods.filter(item => item.id !== id);
    if (type === "mood") state.moods = state.moods.filter(item => item.id !== id);
    if (type === "story") state.stories = state.stories.filter(item => item.id !== id);
    save(KEYS.foods, state.foods);
    save(KEYS.moods, state.moods);
    save(KEYS.stories, state.stories);
    renderAll();
    showToast("Catatan dihapus.");
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    const data = {
      app: "Ruang Kecilku",
      version: 2,
      exportedAt: new Date().toISOString(),
      foods: state.foods,
      moods: state.moods,
      stories: state.stories
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ruang-kecilku-backup-${todayLocal()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup dibuat.");
  });

  document.getElementById("importInput").addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data.foods) || !Array.isArray(data.moods) || !Array.isArray(data.stories)) {
        throw new Error("Format tidak cocok.");
      }
      state.foods = data.foods;
      state.moods = data.moods;
      state.stories = data.stories;
      save(KEYS.foods, state.foods);
      save(KEYS.moods, state.moods);
      save(KEYS.stories, state.stories);
      renderAll();
      showToast("Backup berhasil diimpor.");
    } catch (error) {
      console.error(error);
      alert("File backup tidak valid.");
    } finally {
      event.target.value = "";
    }
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Hapus semua data Ruang Kecilku di browser ini?")) return;
    state.foods = [];
    state.moods = [];
    state.stories = [];
    save(KEYS.foods, state.foods);
    save(KEYS.moods, state.moods);
    save(KEYS.stories, state.stories);
    clearFoodForm();
    clearMoodForm();
    clearStoryForm();
    renderAll();
    showToast("Semua data dihapus.");
    setPage("home");
  });
}

setDefaults();
setupEvents();
renderAll();
setPage("home");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js?v=2.0").catch(() => {});
  });
}
