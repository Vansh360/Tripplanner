# 🌍 WanderPlan — Trip Planner App

A beautiful, fully functional **browser-based Trip Planner App** built with pure HTML, CSS, and JavaScript. No frameworks, no backend, no login required — just open and start planning!

---

## 🖼️ Preview

![WanderPlan Preview](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80)

> Warm tropical theme with mountain hero, trip cards, itinerary manager, budget tracker, and packing list.

---

## ✨ Features

### 🗺️ Trip Management
- Create trips with name, destination, dates, budget, and type
- View all trips as beautiful cards on a dashboard
- Delete trips you no longer need
- Live stats — total trips, days tracked, and budget managed

### 📅 Itinerary Planner
- Add day-wise activities with date and time
- Activities auto-sorted and grouped by date
- Delete individual activities anytime

### 💰 Budget Tracker
- Set a total budget per trip
- Log expenses by category (Stay, Travel, Food, Activities, Shopping, Transport, Misc)
- Live summary — Total Budget / Spent / Remaining
- Visual progress bar showing budget usage
- Highlights in red when over budget

### 🎒 Packing List
- Add items with categories (Clothing, Toiletries, Documents, Medicine, Electronics, Misc)
- Check off items as you pack
- Progress tracker — "5 of 8 items packed (62%)"
- Celebration message when everything is packed 🎉

### 💾 Data Persistence
- All data saved automatically in browser `localStorage`
- Trips survive page refresh and browser close
- No account or internet needed

---

## 📁 Project Structure

```
trip-planner/
│
├── index.html       # Main HTML structure & layout
├── style.css        # All styling — warm tropical theme
├── script.js        # Full app logic — CRUD, tabs, localStorage
└── README.md        # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone or Download

```bash
# Clone the repository
git clone https://github.com/Vansh360/wanderplan.git

# Or simply download the ZIP and extract it
```

### 2. Open in Browser

```bash
# No installation needed!
# Just open index.html in any modern browser

open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

> ✅ Works in Chrome, Firefox, Edge, Safari — no server required.

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Page structure and layout |
| **CSS3** | Styling, animations, responsive design |
| **Vanilla JavaScript** | App logic, DOM manipulation |
| **localStorage API** | Data persistence in browser |
| **Google Fonts** | Playfair Display + DM Sans typography |

---

## 📖 How to Use

### Step 1 — Create a Trip
- Fill in the **Create a New Trip** form
- Enter trip name, destination, dates, budget, and type
- Click **➕ Add Trip**

### Step 2 — Open a Trip
- Your trip appears as a card on the dashboard
- Click **Open Trip →** to manage it

### Step 3 — Plan Your Itinerary
- Go to the **📅 Itinerary** tab
- Add activities with date and time
- Activities are grouped by day automatically

### Step 4 — Track Your Budget
- Go to the **💰 Budget** tab
- Add expenses with categories and amounts
- Watch the progress bar fill up in real time

### Step 5 — Manage Packing
- Go to the **🎒 Packing List** tab
- Add items with categories
- Check them off as you pack

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Escape` | Close the trip detail modal |
| `Enter` | Submit forms (where applicable) |

---

## 🎨 Design Highlights

- **Warm Tropical Theme** — orange, teal, and cream palette
- **Hero Section** — mountain landscape with animated gradient overlay
- **Playfair Display** serif font for headings — editorial feel
- **DM Sans** for body text — clean and readable
- **Smooth animations** — cards fade in, modal slides in
- **Responsive design** — works on mobile, tablet, and desktop
- **Custom scrollbar** styling on messages area

---

## 🔮 Future Enhancements

- [ ] 🗺️ Map integration (Google Maps / Leaflet.js)
- [ ] 🌤️ Weather widget for destination
- [ ] 📄 Export itinerary as PDF
- [ ] 🌙 Dark mode toggle
- [ ] 🔗 Share trip via URL
- [ ] 📸 Add photos to trips
- [ ] 👥 Multi-person trip collaboration
- [ ] 💱 Currency converter for international trips

---

## 🐛 Known Limitations

- Data is stored in `localStorage` — clearing browser data will erase trips
- No cloud sync — trips are device-specific
- No offline map support

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create a new branch
git checkout -b feature/your-feature-name

# 3. Make your changes
# 4. Commit
git commit -m "Add: your feature description"

# 5. Push and open a Pull Request
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

```
MIT License

Copyright (c) 2026 WanderPlan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👨‍💻 Author

Built with ❤️ for explorers everywhere.

> 🌍 *"The world is a book, and those who do not travel read only one page."*

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub — it means a lot!
