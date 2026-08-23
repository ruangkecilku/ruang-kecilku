const KEYS = {
  triggers: "moodTracker.triggers",
  sleep: "moodTracker.sleep",
  journals: "moodTracker.journals"
};

const state = {
  triggers: load(KEYS.triggers),
  sleep: load(KEYS.sleep),
  journals: load(KEYS.journals),
  charts: {},
  overthinking: false,
  control: "Bisa aku kendalikan"
};

function load(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

function formatDateShort(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short"
  }).format(new Date(`${date}T00:00:00`));
}

function todayLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function timeLocal() {
  return new Date().toTimeString().slice(0, 5);
}

function byDateTimeDesc(a, b) {
  return `${b.date || ""} ${b.time || ""}`.localeCompare(`${a.date || ""} ${a.time || ""}`);
}

function getSleepHours(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;
  if (endMin <= startMin) endMin += 24 * 60;
  return Math.round(((endMin - startMin) / 60) * 10) / 10;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function setDefaults() {
  document.getElementById("triggerDate").value = todayLocal();
  document.getElementById("triggerTime").value = timeLocal();
  document.getElementById("sleepDate").value = todayLocal();
  document.getElementById("journalDate").value = todayLocal();
}

function switchPage(page) {
  document.querySelectorAll(".page").forEach(el => el.classList.remove("active"));
  document.getElementById(`page-${page}`).classList.add("active");

  document.querySelectorAll("[data-page]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (page === "insight") {
    setTimeout(renderInsights, 20);
  }
}

document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", () => switchPage(btn.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(btn => {
  btn.addEventListener("click", () => switchPage(btn.dataset.go));
});

function setupRange(inputId, valueId) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(valueId);
  input.addEventListener("input", () => output.textContent = input.value);
}

setupRange("moodIntensity", "moodIntensityValue");
setupRange("overthinkingIntensity", "overthinkingIntensityValue");
setupRange("sleepQuality", "sleepQualityValue");

document.querySelectorAll("#overthinkingToggle button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#overthinkingToggle button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.overthinking = btn.dataset.value === "true";
    document.getElementById("overthinkingFields").classList.toggle("hidden", !state.overthinking);
  });
});

document.querySelectorAll("#controlToggle button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#controlToggle button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.control = btn.dataset.value;
  });
});

document.getElementById("triggerForm").addEventListener("submit", e => {
  e.preventDefault();

  const selectedTriggers = [...document.querySelectorAll("#triggerChips input:checked")].map(i => i.value);

  const entry = {
    id: uid(),
    date: document.getElementById("triggerDate").value,
    time: document.getElementById("triggerTime").value,
    event: document.getElementById("triggerEvent").value.trim(),
    triggers: selectedTriggers,
    mood: document.getElementById("triggerMood").value,
    moodIntensity: Number(document.getElementById("moodIntensity").value),
    overthinking: state.overthinking,
    overthinkingIntensity: state.overthinking ? Number(document.getElementById("overthinkingIntensity").value) : 0,
    control: state.control,
    createdAt: Date.now()
  };

  state.triggers.push(entry);
  save(KEYS.triggers, state.triggers);

  e.target.reset();
  state.overthinking = false;
  state.control = "Bisa aku kendalikan";
  document.getElementById("moodIntensity").value = 5;
  document.getElementById("moodIntensityValue").textContent = "5";
  document.getElementById("overthinkingIntensity").value = 5;
  document.getElementById("overthinkingIntensityValue").textContent = "5";
  document.getElementById("overthinkingFields").classList.add("hidden");
  document.querySelectorAll("#overthinkingToggle button").forEach((b, i) => b.classList.toggle("active", i === 0));
  document.querySelectorAll("#controlToggle button").forEach((b, i) => b.classList.toggle("active", i === 0));
  document.querySelectorAll("#triggerChips input").forEach(i => i.checked = false);
  document.getElementById("triggerDate").value = todayLocal();
  document.getElementById("triggerTime").value = timeLocal();

  renderAll();
  showToast("Trigger disimpan.");
});

document.getElementById("sleepForm").addEventListener("submit", e => {
  e.preventDefault();

  const start = document.getElementById("sleepStart").value;
  const end = document.getElementById("sleepEnd").value;

  state.sleep.push({
    id: uid(),
    date: document.getElementById("sleepDate").value,
    start,
    end,
    hours: getSleepHours(start, end),
    quality: Number(document.getElementById("sleepQuality").value),
    note: document.getElementById("sleepNote").value.trim(),
    createdAt: Date.now()
  });

  save(KEYS.sleep, state.sleep);
  e.target.reset();
  document.getElementById("sleepDate").value = todayLocal();
  document.getElementById("sleepQuality").value = 5;
  document.getElementById("sleepQualityValue").textContent = "5";

  renderAll();
  showToast("Data tidur disimpan.");
});

document.getElementById("journalForm").addEventListener("submit", e => {
  e.preventDefault();

  state.journals.push({
    id: uid(),
    date: document.getElementById("journalDate").value,
    text: document.getElementById("journalText").value.trim(),
    createdAt: Date.now()
  });

  save(KEYS.journals, state.journals);
  e.target.reset();
  document.getElementById("journalDate").value = todayLocal();

  renderAll();
  showToast("Journal disimpan.");
});

function renderHome() {
  const triggers = [...state.triggers].sort(byDateTimeDesc);
  const sleeps = [...state.sleep].sort(byDateTimeDesc);
  const over = triggers.filter(x => x.overthinking);

  document.getElementById("homeTriggerCount").textContent = triggers.length;
  document.getElementById("homeOverthinkingCount").textContent = over.length;

  const latestTrigger = triggers[0];
  const latestSleep = sleeps[0];

  document.getElementById("homeLastMood").textContent = latestTrigger?.mood || "-";
  document.getElementById("homeLastMoodDate").textContent = latestTrigger ? formatDate(latestTrigger.date) : "Belum ada data";

  document.getElementById("homeLastSleep").textContent = latestSleep ? `${latestSleep.hours}j` : "-";
  document.getElementById("homeLastSleepDate").textContent = latestSleep ? formatDate(latestSleep.date) : "Belum ada data";

  const moodCard = document.getElementById("latestMoodCard");
  if (!latestTrigger) {
    moodCard.className = "empty-state";
    moodCard.textContent = "Belum ada catatan mood.";
  } else {
    moodCard.className = "latest-content";
    moodCard.innerHTML = `
      <span class="meta">${formatDate(latestTrigger.date)} · ${latestTrigger.time}</span>
      <strong>${escapeHtml(latestTrigger.mood)} · ${latestTrigger.moodIntensity}/10</strong>
      <p>${escapeHtml(latestTrigger.event)}</p>
    `;
  }

  const overCard = document.getElementById("latestOverthinkingCard");
  const latestOver = over[0];
  if (!latestOver) {
    overCard.className = "empty-state";
    overCard.textContent = "Belum ada catatan overthinking.";
  } else {
    overCard.className = "latest-content";
    overCard.innerHTML = `
      <span class="meta">${formatDate(latestOver.date)} · ${latestOver.time}</span>
      <strong>Intensitas ${latestOver.overthinkingIntensity}/10</strong>
      <p>${escapeHtml(latestOver.event)}</p>
    `;
  }

  const shortInsight = document.getElementById("shortInsight");

if (triggers.length === 0) {
  shortInsight.textContent =
    "Belum ada data. Isi satu catatan trigger untuk mulai melihat insight.";

} else if (triggers.length === 1) {
  const first = triggers[0];

  const triggerText = (first.triggers || []).length
    ? ` Trigger yang tercatat: <strong>${escapeHtml(first.triggers.join(", "))}</strong>.`
    : "";

  const overthinkingText = first.overthinking
    ? ` Overthinking tercatat dengan intensitas <strong>${first.overthinkingIntensity}/10</strong>.`
    : " Tidak ada overthinking yang tercatat pada catatan ini.";

  shortInsight.innerHTML =
    `Catatan pertama menunjukkan mood <strong>${escapeHtml(first.mood)}</strong> ` +
    `dengan intensitas <strong>${first.moodIntensity}/10</strong>.` +
    overthinkingText +
    triggerText +
    ` Tambahkan beberapa catatan lagi untuk melihat pola yang lebih konsisten.`;

} else {
  const avgMood = average(triggers.map(x => x.moodIntensity));
  const topTrigger = topFrequency(triggers.flatMap(x => x.triggers));
  const overPct = Math.round((over.length / triggers.length) * 100);

  shortInsight.innerHTML =
    `Rata-rata intensitas mood <strong>${avgMood.toFixed(1)}/10</strong>. ` +
    `${overPct}% catatan berkaitan dengan overthinking.` +
    `${topTrigger ? ` Trigger yang paling sering muncul adalah <strong>${escapeHtml(topTrigger[0])}</strong>.` : ""}`;
}
}

function renderTriggerHistory() {
  const root = document.getElementById("triggerHistory");
  const items = [...state.triggers].sort(byDateTimeDesc);

  if (!items.length) {
    root.innerHTML = `<div class="empty-state">Belum ada catatan trigger.</div>`;
    return;
  }

  root.innerHTML = items.slice(0, 12).map(item => `
    <article class="history-item">
      <div class="history-top">
        <div>
          <div class="history-title">${escapeHtml(item.mood)} · ${item.moodIntensity}/10</div>
          <div class="history-meta">${formatDate(item.date)} · ${item.time} · ${escapeHtml(item.control)}</div>
        </div>
        <button class="delete-btn" data-delete-trigger="${item.id}">Hapus</button>
      </div>
      <div class="history-body">${escapeHtml(item.event)}</div>
      <div class="badge-row">
        ${(item.triggers || []).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("")}
        ${item.overthinking ? `<span class="badge">Overthinking ${item.overthinkingIntensity}/10</span>` : ""}
      </div>
    </article>
  `).join("");

  root.querySelectorAll("[data-delete-trigger]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.triggers = state.triggers.filter(x => x.id !== btn.dataset.deleteTrigger);
      save(KEYS.triggers, state.triggers);
      renderAll();
      showToast("Catatan trigger dihapus.");
    });
  });
}

function renderSleepHistory() {
  const root = document.getElementById("sleepHistory");
  const items = [...state.sleep].sort(byDateTimeDesc);

  if (!items.length) {
    root.innerHTML = `<div class="empty-state">Belum ada riwayat tidur.</div>`;
    return;
  }

  root.innerHTML = items.slice(0, 12).map(item => `
    <article class="history-item">
      <div class="history-top">
        <div>
          <div class="history-title">${item.hours} jam · kualitas ${item.quality}/10</div>
          <div class="history-meta">${formatDate(item.date)} · ${item.start}–${item.end}</div>
        </div>
        <button class="delete-btn" data-delete-sleep="${item.id}">Hapus</button>
      </div>
      ${item.note ? `<div class="history-body">${escapeHtml(item.note)}</div>` : ""}
    </article>
  `).join("");

  root.querySelectorAll("[data-delete-sleep]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.sleep = state.sleep.filter(x => x.id !== btn.dataset.deleteSleep);
      save(KEYS.sleep, state.sleep);
      renderAll();
      showToast("Data tidur dihapus.");
    });
  });
}

function renderJournalHistory() {
  const root = document.getElementById("journalHistory");
  const items = [...state.journals].sort(byDateTimeDesc);

  if (!items.length) {
    root.innerHTML = `<div class="empty-state">Belum ada journal.</div>`;
    return;
  }

  root.innerHTML = items.slice(0, 12).map(item => `
    <article class="history-item">
      <div class="history-top">
        <div>
          <div class="history-title">${formatDate(item.date)}</div>
        </div>
        <button class="delete-btn" data-delete-journal="${item.id}">Hapus</button>
      </div>
      <div class="history-body">${escapeHtml(item.text)}</div>
    </article>
  `).join("");

  root.querySelectorAll("[data-delete-journal]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.journals = state.journals.filter(x => x.id !== btn.dataset.deleteJournal);
      save(KEYS.journals, state.journals);
      renderAll();
      showToast("Journal dihapus.");
    });
  });
}

function average(values) {
  const valid = values.filter(v => Number.isFinite(Number(v))).map(Number);
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
}

function topFrequency(values) {
  if (!values.length) return null;
  const counts = {};
  values.forEach(v => counts[v] = (counts[v] || 0) + 1);
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
}

function countsBy(values) {
  const counts = {};
  values.forEach(v => counts[v] = (counts[v] || 0) + 1);
  return counts;
}

function renderInsights() {
  const triggers = [...state.triggers].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const over = triggers.filter(x => x.overthinking);

  document.getElementById("insightTriggerCount").textContent = triggers.length;
  document.getElementById("insightOverthinkingCount").textContent = over.length;
  document.getElementById("insightMoodAverage").textContent = average(triggers.map(x => x.moodIntensity)).toFixed(1);
  document.getElementById("insightOverthinkingAverage").textContent = average(over.map(x => x.overthinkingIntensity)).toFixed(1);

  const moodTop = topFrequency(triggers.map(x => x.mood).filter(Boolean));
  document.getElementById("frequentMood").innerHTML = moodTop
    ? `Mood yang paling sering muncul adalah <strong>${escapeHtml(moodTop[0])}</strong>, tercatat ${moodTop[1]} kali.`
    : "Belum ada data.";

  const controlTop = topFrequency(triggers.map(x => x.control).filter(Boolean));
  document.getElementById("controlPattern").innerHTML = controlTop
    ? `Kategori kendali yang paling sering dipilih adalah <strong>${escapeHtml(controlTop[0])}</strong>, sebanyak ${controlTop[1]} catatan.`
    : "Belum ada data.";

  renderCharts(triggers, over);
}

function destroyChart(name) {
  if (state.charts[name]) {
    state.charts[name].destroy();
    state.charts[name] = null;
  }
}

function renderCharts(triggers, over) {
  const hasChart = typeof Chart !== "undefined";
  if (!hasChart) return;

  Chart.defaults.font.family = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  Chart.defaults.color = "#7b746e";
  Chart.defaults.borderColor = "rgba(123, 116, 110, 0.14)";

  // Mood trend
  destroyChart("mood");
  const moodEmpty = document.getElementById("moodChartEmpty");
  moodEmpty.classList.toggle("hidden", triggers.length > 0);
  if (triggers.length) {
    state.charts.mood = new Chart(document.getElementById("moodTrendChart"), {
      type: "line",
      data: {
        labels: triggers.map(x => formatDateShort(x.date)),
        datasets: [{
          label: "Intensitas mood",
          data: triggers.map(x => x.moodIntensity),
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 1, max: 10, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Overthinking intensity
  destroyChart("overthinking");
  const overEmpty = document.getElementById("overthinkingChartEmpty");
  overEmpty.classList.toggle("hidden", over.length > 0);
  if (over.length) {
    const recentOver = over.slice(-12);
    state.charts.overthinking = new Chart(document.getElementById("overthinkingChart"), {
      type: "bar",
      data: {
        labels: recentOver.map(x => formatDateShort(x.date)),
        datasets: [{
          label: "Overthinking",
          data: recentOver.map(x => x.overthinkingIntensity),
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 10, ticks: { stepSize: 2 } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Trigger distribution
  destroyChart("trigger");
  const triggerCounts = countsBy(triggers.flatMap(x => x.triggers || []));
  const triggerEntries = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]);
  const triggerEmpty = document.getElementById("triggerChartEmpty");
  triggerEmpty.classList.toggle("hidden", triggerEntries.length > 0);

  if (triggerEntries.length) {
    state.charts.trigger = new Chart(document.getElementById("triggerChart"), {
      type: "doughnut",
      data: {
        labels: triggerEntries.map(x => x[0]),
        datasets: [{
          data: triggerEntries.map(x => x[1]),
          borderWidth: 3,
          borderColor: "#fffdf9"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { usePointStyle: true, boxWidth: 8, padding: 14 }
          }
        }
      }
    });
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAll() {
  renderHome();
  renderTriggerHistory();
  renderSleepHistory();
  renderJournalHistory();
  if (document.getElementById("page-insight").classList.contains("active")) {
    renderInsights();
  }
}

document.getElementById("refreshBtn").addEventListener("click", () => {
  state.triggers = load(KEYS.triggers);
  state.sleep = load(KEYS.sleep);
  state.journals = load(KEYS.journals);
  renderAll();
  showToast("Data dimuat ulang.");
});

const dataMenu = document.getElementById("dataMenu");
document.getElementById("menuBtn").addEventListener("click", e => {
  e.stopPropagation();
  dataMenu.classList.toggle("hidden");
});

document.addEventListener("click", e => {
  if (!dataMenu.contains(e.target) && e.target.id !== "menuBtn") dataMenu.classList.add("hidden");
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    triggers: state.triggers,
    sleep: state.sleep,
    journals: state.journals
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mood-tracker-backup-${todayLocal()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  dataMenu.classList.add("hidden");
  showToast("Backup dibuat.");
});

document.getElementById("importInput").addEventListener("change", async e => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.triggers) || !Array.isArray(data.sleep) || !Array.isArray(data.journals)) {
      throw new Error("Format tidak valid");
    }

    state.triggers = data.triggers;
    state.sleep = data.sleep;
    state.journals = data.journals;
    save(KEYS.triggers, state.triggers);
    save(KEYS.sleep, state.sleep);
    save(KEYS.journals, state.journals);
    renderAll();
    showToast("Backup berhasil diimpor.");
  } catch {
    alert("File backup tidak valid.");
  } finally {
    e.target.value = "";
    dataMenu.classList.add("hidden");
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  const ok = confirm("Hapus seluruh data Mood Tracker di browser ini?");
  if (!ok) return;

  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  state.triggers = [];
  state.sleep = [];
  state.journals = [];
  renderAll();
  dataMenu.classList.add("hidden");
  showToast("Semua data dihapus.");
});

setDefaults();
renderAll();
