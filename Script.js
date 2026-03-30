/* =========================================
   WanderPlan — Trip Planner App
   script.js  |  Full App Logic
   ========================================= */

// ── State ─────────────────────────────────────────────────────────────────────

/** @type {Trip[]} */
let trips = [];

/**
 * @typedef {{ id:string, name:string, destination:string, startDate:string,
 *   endDate:string, budget:number, type:string, notes:string,
 *   itinerary: DayEntry[], expenses: Expense[], packing: PackItem[] }} Trip
 * @typedef {{ id:string, date:string, activity:string, time:string }} DayEntry
 * @typedef {{ id:string, name:string, category:string, amount:number }} Expense
 * @typedef {{ id:string, item:string, category:string, done:boolean }} PackItem
 */

/** Currently open trip id */
let activeTripId = null;

// ── Persistence ───────────────────────────────────────────────────────────────

function save() {
  localStorage.setItem("wanderplan_trips", JSON.stringify(trips));
}

function load() {
  try {
    const raw = localStorage.getItem("wanderplan_trips");
    if (raw) trips = JSON.parse(raw);
  } catch { trips = []; }
}

// ── Utils ─────────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function tripDays(trip) {
  if (!trip.startDate || !trip.endDate) return 0;
  const ms = new Date(trip.endDate) - new Date(trip.startDate);
  return Math.max(0, Math.round(ms / 86400000) + 1);
}

function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

// ── Header Stats ──────────────────────────────────────────────────────────────

function updateStats() {
  document.getElementById("totalTrips").textContent = trips.length;
  const days   = trips.reduce((s, t) => s + tripDays(t), 0);
  const budget = trips.reduce((s, t) => s + (Number(t.budget) || 0), 0);
  document.getElementById("totalDays").textContent   = days;
  document.getElementById("totalBudget").textContent = fmt(budget);
}

// ── Trips Rendering ───────────────────────────────────────────────────────────

function renderTrips() {
  const grid   = document.getElementById("tripsGrid");
  const empty  = document.getElementById("emptyTrips");
  grid.innerHTML = "";

  if (trips.length === 0) {
    grid.appendChild(empty);
    return;
  }

  trips.forEach(trip => {
    const spent = trip.expenses.reduce((s, e) => s + e.amount, 0);
    const card  = document.createElement("div");
    card.className = "trip-card";
    card.innerHTML = `
      <div class="trip-card-banner"></div>
      <div class="trip-card-body">
        <div class="trip-card-top">
          <span class="trip-type-badge">${trip.type || "✈️ Trip"}</span>
          <button class="btn-danger" onclick="deleteTrip(event,'${trip.id}')" title="Delete trip">🗑️</button>
        </div>
        <h3>${trip.name}</h3>
        <p class="dest">📍 ${trip.destination || "—"}</p>
        <div class="trip-card-meta">
          <span>📅 ${formatDate(trip.startDate)}</span>
          <span>⏳ ${tripDays(trip)} days</span>
          <span>📋 ${trip.itinerary.length} activities</span>
        </div>
        <div class="trip-card-footer">
          <span class="trip-budget-badge">${fmt(trip.budget)} budget</span>
          <button class="open-btn" onclick="openTrip('${trip.id}')">Open Trip →</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  updateStats();
}

// ── Add / Delete Trip ─────────────────────────────────────────────────────────

function addTrip() {
  const name   = document.getElementById("tripName").value.trim();
  const dest   = document.getElementById("tripDest").value.trim();
  const start  = document.getElementById("tripStart").value;
  const end    = document.getElementById("tripEnd").value;
  const budget = parseFloat(document.getElementById("tripBudget").value) || 0;
  const type   = document.getElementById("tripType").value;
  const notes  = document.getElementById("tripNotes").value.trim();

  if (!name) { alert("Please enter a trip name!"); return; }

  const trip = {
    id: uid(), name, destination: dest,
    startDate: start, endDate: end,
    budget, type, notes,
    itinerary: [], expenses: [], packing: []
  };

  trips.unshift(trip);
  save();
  renderTrips();

  // Reset form
  ["tripName","tripDest","tripStart","tripEnd","tripBudget","tripNotes"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("tripType").selectedIndex = 0;
}

function deleteTrip(e, id) {
  e.stopPropagation();
  if (!confirm("Delete this trip? This cannot be undone.")) return;
  trips = trips.filter(t => t.id !== id);
  save();
  renderTrips();
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function openTrip(id) {
  activeTripId = id;
  const trip = trips.find(t => t.id === id);
  if (!trip) return;

  document.getElementById("modalTitle").textContent  = trip.name;
  document.getElementById("modalMeta").textContent   =
    `${trip.destination || "—"}  •  ${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}  •  ${trip.type || "Trip"}`;
  document.getElementById("modalBudgetPill").textContent = fmt(trip.budget) + " budget";

  switchTab("itinerary");
  document.getElementById("modalOverlay").classList.add("open");
}

function closeModal(e) {
  if (e && e.target !== document.getElementById("modalOverlay")) return;
  document.getElementById("modalOverlay").classList.remove("open");
  activeTripId = null;
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

function switchTab(name) {
  document.querySelectorAll(".tab").forEach((t, i) => {
    const names = ["itinerary","budget","packing"];
    t.classList.toggle("active", names[i] === name);
  });
  document.querySelectorAll(".tab-content").forEach(tc => {
    tc.classList.toggle("active", tc.id === "tab-" + name);
  });

  if (name === "itinerary") renderItinerary();
  if (name === "budget")    renderBudget();
  if (name === "packing")   renderPacking();
}

// ── Itinerary ─────────────────────────────────────────────────────────────────

function addDay() {
  const trip     = trips.find(t => t.id === activeTripId);
  const date     = document.getElementById("dayDate").value;
  const activity = document.getElementById("dayActivity").value.trim();
  const time     = document.getElementById("dayTime").value.trim();

  if (!activity) { alert("Please enter an activity!"); return; }

  trip.itinerary.push({ id: uid(), date, activity, time });
  trip.itinerary.sort((a, b) => (a.date > b.date ? 1 : -1));
  save();
  renderItinerary();

  document.getElementById("dayActivity").value = "";
  document.getElementById("dayTime").value = "";
}

function deleteDay(id) {
  const trip = trips.find(t => t.id === activeTripId);
  trip.itinerary = trip.itinerary.filter(d => d.id !== id);
  save();
  renderItinerary();
}

function renderItinerary() {
  const trip = trips.find(t => t.id === activeTripId);
  const list = document.getElementById("itineraryList");
  list.innerHTML = "";

  if (trip.itinerary.length === 0) {
    list.innerHTML = `<p style="color:var(--muted);text-align:center;padding:24px">No activities yet. Add your first one above!</p>`;
    return;
  }

  // Group by date
  const grouped = {};
  trip.itinerary.forEach(d => {
    const key = d.date || "No Date";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d);
  });

  Object.entries(grouped).forEach(([date, items]) => {
    const dateHeader = document.createElement("p");
    dateHeader.style.cssText = "font-size:13px;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:1px;margin:12px 0 8px";
    dateHeader.textContent   = date === "No Date" ? "📌 No Date" : "📅 " + formatDate(date);
    list.appendChild(dateHeader);

    items.forEach(d => {
      const el = document.createElement("div");
      el.className = "list-item";
      el.innerHTML = `
        <div class="list-item-icon">🗺️</div>
        <div class="list-item-body">
          <strong>${d.activity}</strong>
          <span>${d.time ? "🕐 " + d.time : "All day"}</span>
        </div>
        <div class="list-item-right">
          <button class="btn-danger" onclick="deleteDay('${d.id}')">🗑️</button>
        </div>`;
      list.appendChild(el);
    });
  });
}

// ── Budget ────────────────────────────────────────────────────────────────────

function addExpense() {
  const trip   = trips.find(t => t.id === activeTripId);
  const name   = document.getElementById("expName").value.trim();
  const cat    = document.getElementById("expCategory").value;
  const amount = parseFloat(document.getElementById("expAmount").value) || 0;

  if (!name || amount <= 0) { alert("Please enter expense name and amount!"); return; }

  trip.expenses.push({ id: uid(), name, category: cat, amount });
  save();
  renderBudget();

  document.getElementById("expName").value   = "";
  document.getElementById("expAmount").value = "";
}

function deleteExpense(id) {
  const trip = trips.find(t => t.id === activeTripId);
  trip.expenses = trip.expenses.filter(e => e.id !== id);
  save();
  renderBudget();
}

function renderBudget() {
  const trip  = trips.find(t => t.id === activeTripId);
  const spent = trip.expenses.reduce((s, e) => s + e.amount, 0);
  const left  = trip.budget - spent;
  const pct   = trip.budget > 0 ? Math.min(100, (spent / trip.budget) * 100) : 0;

  // Summary cards
  const summaryEl = document.getElementById("budgetSummary");
  summaryEl.innerHTML = `
    <div class="budget-box neutral">
      <div class="label">Total Budget</div>
      <div class="value">${fmt(trip.budget)}</div>
    </div>
    <div class="budget-box danger">
      <div class="label">Spent</div>
      <div class="value">${fmt(spent)}</div>
    </div>
    <div class="budget-box ${left >= 0 ? "success" : "danger"}">
      <div class="label">${left >= 0 ? "Remaining" : "Over Budget"}</div>
      <div class="value">${fmt(Math.abs(left))}</div>
    </div>`;

  // Progress bar
  const barWrap = document.createElement("div");
  barWrap.className = "budget-bar-wrap";
  barWrap.innerHTML = `
    <div class="budget-bar-label">Spent ${pct.toFixed(1)}% of budget</div>
    <div class="budget-bar-bg">
      <div class="budget-bar-fill ${left < 0 ? "over" : ""}" style="width:${pct}%"></div>
    </div>`;
  summaryEl.after(barWrap);

  // Expenses list
  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  // Remove old bar if present
  document.querySelectorAll(".budget-bar-wrap").forEach((el, i) => { if (i > 0) el.remove(); });
  if (document.querySelector(".budget-bar-wrap")) document.querySelector(".budget-bar-wrap").replaceWith(barWrap);
  else summaryEl.after(barWrap);

  if (trip.expenses.length === 0) {
    list.innerHTML = `<p style="color:var(--muted);text-align:center;padding:24px">No expenses yet. Add your first one!</p>`;
    return;
  }

  trip.expenses.forEach(e => {
    const el = document.createElement("div");
    el.className = "list-item";
    el.innerHTML = `
      <div class="list-item-icon">${e.category.split(" ")[0]}</div>
      <div class="list-item-body">
        <strong>${e.name}</strong>
        <span>${e.category}</span>
      </div>
      <div class="list-item-right">
        <span class="amount-tag">${fmt(e.amount)}</span>
        <button class="btn-danger" onclick="deleteExpense('${e.id}')">🗑️</button>
      </div>`;
    list.appendChild(el);
  });
}

// ── Packing List ──────────────────────────────────────────────────────────────

function addPackItem() {
  const trip = trips.find(t => t.id === activeTripId);
  const item = document.getElementById("packItem").value.trim();
  const cat  = document.getElementById("packCategory").value;

  if (!item) { alert("Please enter an item name!"); return; }

  trip.packing.push({ id: uid(), item, category: cat, done: false });
  save();
  renderPacking();

  document.getElementById("packItem").value = "";
}

function togglePackItem(id) {
  const trip = trips.find(t => t.id === activeTripId);
  const item = trip.packing.find(p => p.id === id);
  if (item) item.done = !item.done;
  save();
  renderPacking();
}

function deletePackItem(id) {
  const trip = trips.find(t => t.id === activeTripId);
  trip.packing = trip.packing.filter(p => p.id !== id);
  save();
  renderPacking();
}

function renderPacking() {
  const trip = trips.find(t => t.id === activeTripId);
  const list = document.getElementById("packingList");
  list.innerHTML = "";

  const done  = trip.packing.filter(p => p.done).length;
  const total = trip.packing.length;

  if (total === 0) {
    list.innerHTML = `<p style="color:var(--muted);text-align:center;padding:24px">No items yet. Start packing!</p>`;
    document.getElementById("packProgress").textContent = "";
    return;
  }

  // Group by category
  const grouped = {};
  trip.packing.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  Object.entries(grouped).forEach(([cat, items]) => {
    const catHeader = document.createElement("p");
    catHeader.style.cssText = "font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin:12px 0 8px";
    catHeader.textContent = cat;
    list.appendChild(catHeader);

    items.forEach(p => {
      const el = document.createElement("div");
      el.className = "list-item" + (p.done ? " pack-done" : "");
      el.innerHTML = `
        <input type="checkbox" class="pack-check" ${p.done ? "checked" : ""}
          onchange="togglePackItem('${p.id}')" />
        <div class="list-item-body">
          <strong>${p.item}</strong>
        </div>
        <div class="list-item-right">
          <button class="btn-danger" onclick="deletePackItem('${p.id}')">🗑️</button>
        </div>`;
      list.appendChild(el);
    });
  });

  const pct = Math.round((done / total) * 100);
  const prog = document.getElementById("packProgress");
  prog.textContent = done === total
    ? `🎉 All packed! You're ready to go (${total}/${total})`
    : `🎒 ${done} of ${total} items packed (${pct}%)`;
}

// ── Keyboard shortcuts ────────────────────────────────────────────────────────

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.getElementById("modalOverlay").classList.remove("open");
    activeTripId = null;
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────

load();
renderTrips();