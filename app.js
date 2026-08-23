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
  control: "Bisa aku kendalikan",
  insightPeriod: 7
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

function formatDateLong(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

function formatActivityDate(date, time = "") {
  if (!date) return "-";
  const today = todayLocal();
  const prefix = date === today ? "Hari ini" : formatDateShort(date);
  return time ? `${prefix} · ${time}` : prefix;
}

function fallbackTimestamp(item, type) {
  if (Number.isFinite(Number(item.createdAt))) return Number(item.createdAt);

  let time = "12:00";
  if (type === "trigger" && item.time) time = item.time;
  if (type === "sleep" && item.end) time = item.end;

  const stamp = new Date(`${item.date || "1970-01-01"}T${time}:00`).getTime();
  return Number.isFinite(stamp) ? stamp : 0;
}

function uniqueActiveDates(triggers, sleeps, journals) {
  return new Set([
    ...triggers.map(x => x.date),
    ...sleeps.map(x => x.date),
    ...journals.map(x => x.date)
  ].filter(Boolean)).size;
}

function todayLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function timeLocal() {
  return new Date().toTimeString().slice(0, 5);
}

function startDateForDays(days) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (days - 1));
  return d;
}

function isDateInLastDays(dateString, days) {
  if (!dateString) return false;
  const d = new Date(`${dateString}T00:00:00`);
  return d >= startDateForDays(days);
}

function filterByInsightPeriod(items) {
  if (state.insightPeriod === "all") return [...items];
  return items.filter(item => isDateInLastDays(item.date, Number(state.insightPeriod)));
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

document.querySelectorAll("#insightPeriod [data-period]").forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.period;
    state.insightPeriod = value === "all" ? "all" : Number(value);

    document.querySelectorAll("#insightPeriod [data-period]").forEach(item => {
      item.classList.toggle("active", item === btn);
    });

    renderInsights();
  });
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
  const journals = [...state.journals].sort(byDateTimeDesc);

  const latestTrigger = triggers[0];
  const latestOverthinking = triggers.find(x => x.overthinking);
  const latestSleep = sleeps[0];

  document.getElementById("homeDate").textContent = formatDateLong(todayLocal());

  document.getElementById("homeLatestMood").textContent =
    latestTrigger ? `${latestTrigger.mood} · ${latestTrigger.moodIntensity}/10` : "-";
  document.getElementById("homeLatestMoodMeta").textContent =
    latestTrigger
      ? formatActivityDate(latestTrigger.date, latestTrigger.time)
      : "Belum ada catatan";

  document.getElementById("homeLatestOverthinking").textContent =
    latestOverthinking ? `${latestOverthinking.overthinkingIntensity}/10` : "-";
  document.getElementById("homeLatestOverthinkingMeta").textContent =
    latestOverthinking
      ? formatActivityDate(latestOverthinking.date, latestOverthinking.time)
      : "Belum tercatat";

  document.getElementById("homeLatestSleep").textContent =
    latestSleep ? `${latestSleep.hours} jam` : "-";
  document.getElementById("homeLatestSleepMeta").textContent =
    latestSleep
      ? `${formatDate(latestSleep.date)} · kualitas ${latestSleep.quality}/10`
      : "Belum ada data";

  const activities = [
    ...state.triggers.map(item => ({
      type: "trigger",
      label: "Trigger dicatat",
      date: item.date,
      time: item.time || "",
      timestamp: fallbackTimestamp(item, "trigger")
    })),
    ...state.sleep.map(item => ({
      type: "sleep",
      label: "Data tidur dicatat",
      date: item.date,
      time: "",
      timestamp: fallbackTimestamp(item, "sleep")
    })),
    ...state.journals.map(item => ({
      type: "journal",
      label: "Journal ditulis",
      date: item.date,
      time: "",
      timestamp: fallbackTimestamp(item, "journal")
    }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  const root = document.getElementById("recentActivity");

  if (!activities.length) {
    root.innerHTML = `<div class="empty-state">Belum ada aktivitas.</div>`;
    return;
  }

  const symbols = {
    trigger: "✦",
    sleep: "◔",
    journal: "▤"
  };

  root.innerHTML = activities.slice(0, 6).map(item => `
    <div class="activity-item">
      <div class="activity-icon">${symbols[item.type]}</div>
      <div class="activity-copy">
        <strong>${item.label}</strong>
        <span>${formatActivityDate(item.date, item.time)}</span>
      </div>
    </div>
  `).join("");
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
  const allTriggers = [...state.triggers].sort((a, b) =>
    `${a.date} ${a.time || ""}`.localeCompare(`${b.date} ${b.time || ""}`)
  );
  const allSleep = [...state.sleep].sort((a, b) =>
    `${a.date} ${a.start || ""}`.localeCompare(`${b.date} ${b.start || ""}`)
  );
  const allJournals = [...state.journals].sort((a, b) =>
    `${a.date}`.localeCompare(`${b.date}`)
  );

  const triggers = filterByInsightPeriod(allTriggers);
  const sleeps = filterByInsightPeriod(allSleep);
  const journals = filterByInsightPeriod(allJournals);
  const over = triggers.filter(x => x.overthinking);

  const periodLabel =
    state.insightPeriod === "all"
      ? "Semua data"
      : `${state.insightPeriod} hari terakhir`;

  document.getElementById("insightPeriodNote").textContent = periodLabel;

  const moodAvg = average(triggers.map(x => x.moodIntensity));
  const sleepAvg = average(sleeps.map(x => x.hours));
  const overRate = triggers.length
    ? Math.round((over.length / triggers.length) * 100)
    : 0;
  const activeDays = uniqueActiveDates(triggers, sleeps, journals);

  document.getElementById("insightMoodIntensity").textContent =
    triggers.length ? `${moodAvg.toFixed(1)}/10` : "-";

  document.getElementById("insightOverthinkingRate").textContent =
    triggers.length ? `${overRate}%` : "-";

  document.getElementById("insightSleepAverage").textContent =
    sleeps.length ? `${sleepAvg.toFixed(1)}j` : "-";

  document.getElementById("insightActiveDays").textContent =
    activeDays ? String(activeDays) : "-";

  renderTriggerRanking(triggers);
  renderRelationshipInsights(triggers, sleeps);
  renderCharts(triggers, sleeps);
}

function renderTriggerRanking(triggers) {
  const root = document.getElementById("triggerRanking");
  const triggerCounts = countsBy(triggers.flatMap(x => x.triggers || []));
  const entries = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]);

  if (!entries.length) {
    root.innerHTML = `<div class="ranking-empty">Belum ada trigger pada periode ini.</div>`;
    return;
  }

  const max = entries[0][1];

  root.innerHTML = entries.slice(0, 8).map(([name, count], index) => {
    const width = Math.max(8, Math.round((count / max) * 100));
    return `
      <div class="ranking-item">
        <div class="ranking-number">${index + 1}</div>
        <div class="ranking-main">
          <div class="ranking-head">
            <strong>${escapeHtml(name)}</strong>
            <span>${count}x</span>
          </div>
          <div class="ranking-bar"><span style="width:${width}%"></span></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderRelationshipInsights(triggers, sleeps) {
  const root = document.getElementById("relationshipInsights");
  const relationships = [];

  // Relationship 1: sleep duration and overthinking on matching dates.
  const sleepByDate = {};
  sleeps.forEach(item => {
    if (!item.date) return;
    if (!sleepByDate[item.date]) sleepByDate[item.date] = [];
    sleepByDate[item.date].push(Number(item.hours));
  });

  const sleepAverageByDate = {};
  Object.entries(sleepByDate).forEach(([date, hours]) => {
    sleepAverageByDate[date] = average(hours);
  });

  const matched = triggers
    .filter(item => sleepAverageByDate[item.date] !== undefined)
    .map(item => ({
      sleepHours: sleepAverageByDate[item.date],
      overScore: item.overthinking ? Number(item.overthinkingIntensity || 0) : 0
    }));

  const lowSleep = matched.filter(x => x.sleepHours < 6);
  const sufficientSleep = matched.filter(x => x.sleepHours >= 7);

  if (lowSleep.length >= 2 && sufficientSleep.length >= 2) {
    const lowAvg = average(lowSleep.map(x => x.overScore));
    const sufficientAvg = average(sufficientSleep.map(x => x.overScore));

    relationships.push(`
      <div class="relationship-item">
        <strong>Tidur dan overthinking</strong>
        <p>Pada tanggal yang memiliki kedua jenis catatan, intensitas overthinking rata-rata <b>${lowAvg.toFixed(1)}/10</b> saat tidur kurang dari 6 jam dan <b>${sufficientAvg.toFixed(1)}/10</b> saat tidur 7 jam atau lebih.</p>
      </div>
    `);
  }

  // Relationship 2: trigger category and overthinking intensity.
  const byTrigger = {};
  triggers.forEach(item => {
    (item.triggers || []).forEach(category => {
      if (!byTrigger[category]) byTrigger[category] = [];
      byTrigger[category].push(item.overthinking ? Number(item.overthinkingIntensity || 0) : 0);
    });
  });

  const eligibleTriggers = Object.entries(byTrigger)
    .filter(([, values]) => values.length >= 2)
    .map(([category, values]) => ({
      category,
      count: values.length,
      average: average(values)
    }))
    .sort((a, b) => b.average - a.average);

  if (eligibleTriggers.length >= 2) {
    const highest = eligibleTriggers[0];
    relationships.push(`
      <div class="relationship-item">
        <strong>Trigger dan intensitas overthinking</strong>
        <p>Di antara trigger yang tercatat minimal dua kali, <b>${escapeHtml(highest.category)}</b> memiliki rata-rata intensitas overthinking tertinggi, yaitu <b>${highest.average.toFixed(1)}/10</b> dari ${highest.count} catatan.</p>
      </div>
    `);
  }

  if (!relationships.length) {
    root.innerHTML = `
      <div class="relationship-empty">
        Belum cukup data untuk membandingkan hubungan antar-catatan.
        Tambahkan beberapa catatan Trigger dan Tidur pada tanggal yang sama agar pola lintas data dapat dibandingkan.
      </div>
    `;
    return;
  }

  root.innerHTML = relationships.slice(0, 2).join("");
}

function destroyChart(name) {
  if (state.charts[name]) {
    state.charts[name].destroy();
    state.charts[name] = null;
  }
}

function renderCharts(triggers, sleeps) {
  const hasChart = typeof Chart !== "undefined";
  if (!hasChart) return;

  Chart.defaults.font.family = '"Nunito Sans", Arial, sans-serif';
  Chart.defaults.color = "#7B7B72";
  Chart.defaults.borderColor = "rgba(123, 123, 114, 0.16)";

  // 1. Mood frequency
  destroyChart("moodFrequency");
  const moodCounts = countsBy(triggers.map(x => x.mood).filter(Boolean));
  const moodEntries = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const moodEmpty = document.getElementById("moodFrequencyEmpty");
  moodEmpty.classList.toggle("hidden", moodEntries.length > 0);

  if (moodEntries.length) {
    state.charts.moodFrequency = new Chart(
      document.getElementById("moodFrequencyChart"),
      {
        type: "bar",
        data: {
          labels: moodEntries.map(x => x[0]),
          datasets: [{
            label: "Jumlah catatan",
            data: moodEntries.map(x => x[1]),
            backgroundColor: "rgba(92, 115, 95, 0.78)",
            borderColor: "#5C735F",
            borderWidth: 1,
            borderRadius: 8
          }]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: context => `${context.raw} catatan`
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { precision: 0, stepSize: 1 }
            },
            y: { grid: { display: false } }
          }
        }
      }
    );
  }

  // 2. Overthinking trend per trigger entry.
  destroyChart("overthinkingTrend");
  const overEmpty = document.getElementById("overthinkingTrendEmpty");
  overEmpty.classList.toggle("hidden", triggers.length > 0);

  if (triggers.length) {
    const recent = triggers.slice(-30);
    state.charts.overthinkingTrend = new Chart(
      document.getElementById("overthinkingTrendChart"),
      {
        type: "line",
        data: {
          labels: recent.map(x => formatDateShort(x.date)),
          datasets: [{
            label: "Intensitas overthinking",
            data: recent.map(x => x.overthinking ? Number(x.overthinkingIntensity || 0) : 0),
            borderColor: "#EFA0BD",
            backgroundColor: "rgba(239, 160, 189, 0.16)",
            pointBackgroundColor: "#EFA0BD",
            pointBorderColor: "#FFFDF8",
            borderWidth: 2,
            tension: 0.32,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: context =>
                  context.raw === 0
                    ? "Tidak tercatat overthinking"
                    : `Intensitas ${context.raw}/10`
              }
            }
          },
          scales: {
            y: {
              min: 0,
              max: 10,
              ticks: { stepSize: 2 }
            },
            x: { grid: { display: false } }
          }
        }
      }
    );
  }

  // 3. Sleep duration
  destroyChart("sleepDuration");
  const sleepEmpty = document.getElementById("sleepDurationEmpty");
  sleepEmpty.classList.toggle("hidden", sleeps.length > 0);

  if (sleeps.length) {
    const recentSleep = sleeps.slice(-30);
    state.charts.sleepDuration = new Chart(
      document.getElementById("sleepDurationChart"),
      {
        type: "bar",
        data: {
          labels: recentSleep.map(x => formatDateShort(x.date)),
          datasets: [{
            label: "Durasi tidur",
            data: recentSleep.map(x => Number(x.hours || 0)),
            backgroundColor: "rgba(92, 115, 95, 0.58)",
            borderColor: "#5C735F",
            borderWidth: 1,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: context => `${context.raw} jam`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 10,
              ticks: {
                callback: value => `${value}j`
              }
            },
            x: { grid: { display: false } }
          }
        }
      }
    );
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
