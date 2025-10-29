document.addEventListener("DOMContentLoaded", () => {
  // ======== STATE MANAGEMENT ========
  let settings = {};
  const defaultSettings = {
    wallpaper: {
      url: "wallpaper.gif",
      size: "cover",
      position: "center center",
    },
    notes: "",
    shortcuts: [
      {
        name: "ChatGPT",
        url: "https://chatgpt.com/",
        icon: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=64",
      },
      {
        name: "YouTube",
        url: "https://youtube.com",
        icon: "https://www.google.com/s2/favicons?domain=youtube.com&sz=64",
      },
      {
        name: "Reddit",
        url: "https://reddit.com",
        icon: "https://www.google.com/s2/favicons?domain=reddit.com&sz=64",
      },
    ],
    layout: {
      timeSize: "8",
      searchWidth: "600",
      iconSize: "48",
      colGap: "20",
      rowGap: "20",
      contentPosition: "center",
      columnsPerRow: "5",
      iconsPerColumn: "5",
    },
    time: { hour12: true, showAmPm: true },
    weather: {
      // NEW: Weather settings
      city: "Bhubaneswar", // Default city
    },
  };

  function saveSettings() {
    localStorage.setItem("homepageSettings", JSON.stringify(settings));
  }

  function loadSettings() {
    const saved = localStorage.getItem("homepageSettings");
    if (saved) {
      let savedSettings = JSON.parse(saved);
      // Merge layout settings
      if (savedSettings.layout) {
        /* ... merge logic ... */
        if (
          savedSettings.layout.iconsPerRow &&
          !savedSettings.layout.columnsPerRow
        ) {
          savedSettings.layout.columnsPerRow = savedSettings.layout.iconsPerRow;
          delete savedSettings.layout.iconsPerRow;
        }
        if (
          savedSettings.layout.rowsPerColumn &&
          !savedSettings.layout.iconsPerColumn
        ) {
          savedSettings.layout.iconsPerColumn =
            savedSettings.layout.rowsPerColumn;
          delete savedSettings.layout.rowsPerColumn;
        }
        savedSettings.layout = {
          ...defaultSettings.layout,
          ...savedSettings.layout,
        };
      } else {
        savedSettings.layout = { ...defaultSettings.layout };
      }
      // Merge time settings
      if (savedSettings.time) {
        savedSettings.time = { ...defaultSettings.time, ...savedSettings.time };
      } else {
        savedSettings.time = { ...defaultSettings.time };
      }
      // NEW: Merge weather settings
      if (savedSettings.weather) {
        savedSettings.weather = {
          ...defaultSettings.weather,
          ...savedSettings.weather,
        };
      } else {
        savedSettings.weather = { ...defaultSettings.weather };
      }

      settings = { ...defaultSettings, ...savedSettings };
    } else {
      settings = JSON.parse(JSON.stringify(defaultSettings));
    }
    applySettings();
  }

  // UPDATED applySettings (only relevant part shown)
  function applySettings() {
    // ... (wallpaper, notes, layout apply unchanged) ...
    document.body.style.backgroundImage = `url(${settings.wallpaper.url})`;
    document.body.style.backgroundSize = settings.wallpaper.size;
    document.body.style.backgroundPosition = settings.wallpaper.position;
    document.getElementById("notes-textarea").value = settings.notes;
    const root = document.documentElement;
    root.style.setProperty(
      "--time-font-size",
      `${settings.layout.timeSize}rem`
    );
    root.style.setProperty(
      "--search-bar-width",
      `${settings.layout.searchWidth}px`
    );
    root.style.setProperty("--icon-size", `${settings.layout.iconSize}px`);
    root.style.setProperty("--grid-col-gap", `${settings.layout.colGap}px`);
    root.style.setProperty("--grid-row-gap", `${settings.layout.rowGap}px`);
    root.style.setProperty(
      "--content-justify",
      settings.layout.contentPosition
    );
    root.style.setProperty(
      "--grid-icons-per-column",
      settings.layout.iconsPerColumn
    );
    root.style.setProperty("--grid-columns", settings.layout.columnsPerRow);

    renderShortcuts();
    updateSliderUI();
    document.getElementById("bg-size").value = settings.wallpaper.size;
    document.getElementById("bg-pos").value = settings.wallpaper.position;
    updateTime();
    document.getElementById("time-format-toggle").checked =
      !settings.time.hour12;
    document.getElementById("time-ampm-toggle").checked =
      settings.time.showAmPm;
    updateAmPmToggleState();

    // NEW: Update weather input field with saved city
    document.getElementById("weather-city-input").value = settings.weather.city;
    // Fetch weather for the saved city (will be called later by initial load)
  }

  // ... (updateSliderUI unchanged) ...
  function updateSliderUI() {
    /* ... unchanged ... */
    document.getElementById("time-size").value = settings.layout.timeSize;
    document.getElementById("time-size-val").textContent =
      settings.layout.timeSize;
    document.getElementById("search-width").value = settings.layout.searchWidth;
    document.getElementById("search-width-val").textContent =
      settings.layout.searchWidth;
    document.getElementById("icon-size").value = settings.layout.iconSize;
    document.getElementById("icon-size-val").textContent =
      settings.layout.iconSize;
    const iconsPerColSlider = document.getElementById("icons-per-column");
    const iconsPerColVal = document.getElementById("icons-per-column-val");
    if (iconsPerColSlider && iconsPerColVal) {
      iconsPerColSlider.value = settings.layout.iconsPerColumn;
      iconsPerColVal.textContent = settings.layout.iconsPerColumn;
    } else {
      const rowsPerColSlider = document.getElementById("rows-per-column");
      const rowsPerColVal = document.getElementById("rows-per-column-val");
      if (rowsPerColSlider && rowsPerColVal) {
        rowsPerColSlider.value = settings.layout.iconsPerColumn;
        rowsPerColVal.textContent = settings.layout.iconsPerColumn;
      }
    }
    const colsPerRowSlider = document.getElementById("columns-per-row");
    const colsPerRowVal = document.getElementById("columns-per-row-val");
    if (colsPerRowSlider && colsPerRowVal) {
      colsPerRowSlider.value = settings.layout.columnsPerRow;
      colsPerRowVal.textContent = settings.layout.columnsPerRow;
    } else {
      const iconsPerRowSlider = document.getElementById("icons-per-row");
      const iconsPerRowVal = document.getElementById("icons-per-row-val");
      if (iconsPerRowSlider && iconsPerRowVal) {
        iconsPerRowSlider.value = settings.layout.columnsPerRow;
        iconsPerRowVal.textContent = settings.layout.columnsPerRow;
      }
    }
    document.getElementById("col-gap").value = settings.layout.colGap;
    document.getElementById("col-gap-val").textContent = settings.layout.colGap;
    document.getElementById("row-gap").value = settings.layout.rowGap;
    document.getElementById("row-gap-val").textContent = settings.layout.rowGap;
    document.getElementById("content-position").value =
      settings.layout.contentPosition;
  }

  // ======== TIME WIDGET ========
  // ... (unchanged) ...
  const timeWidget = document.getElementById("time-widget");
  function updateTime() {
    const now = new Date();
    let options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: settings.time.hour12,
    };
    let timeString = now.toLocaleTimeString([], options);
    if (settings.time.hour12 && !settings.time.showAmPm) {
      timeString = timeString.replace(/ (AM|PM)/i, "");
    }
    timeWidget.textContent = timeString;
  }
  setInterval(updateTime, 1000);

  // ======== WEATHER WIDGET (UPDATED) ========
  const weatherCityInput = document.getElementById("weather-city-input");
  const weatherSearchBtn = document.getElementById("weather-search-btn"); // NEW Button reference

  function fetchWeather(cityName) {
    const cityToFetch = cityName || settings.weather.city || "Bhubaneswar";
    console.log("Fetching weather for:", cityToFetch);

    const apiKey = "1ed489abf33ffc9ab31faa43cccefe30"; // <-- PASTE YOUR OPENWEATHERMAP API KEY HERE
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityToFetch}&appid=${apiKey}&units=metric`;

    if (!apiKey) {
      console.warn("Weather widget: API key not set in script.js");
      document.getElementById("weather-temp").textContent = "--°C";
      document.getElementById("weather-desc").textContent = "Set API Key";
      document.getElementById("weather-icon").textContent = "⚠️";
      document.getElementById("weather-feels-like").textContent =
        "Feels like --°C";
      document.getElementById("weather-humidity").textContent = "--%";
      document.getElementById("weather-wind").textContent = "-- km/h";
      document.querySelector("#weather-widget small").textContent =
        "(Add API key in script.js)"; // Keep warning text
      document.querySelector("#weather-widget small").style.display = "block";
      return;
    }

    // Fetch and update UI
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`City not found (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("weather-temp").textContent = `${Math.round(
          data.main.temp
        )}°C`;
        document.getElementById("weather-desc").textContent =
          data.weather[0].main;
        document.getElementById("weather-icon").textContent = getWeatherIcon(
          data.weather[0].icon
        );
        // Update input field ONLY if the fetched city matches input or on initial load
        if (
          cityToFetch.toLowerCase() === weatherCityInput.value.toLowerCase() ||
          !weatherCityInput.value
        ) {
          weatherCityInput.value = data.name;
        }
        document.getElementById(
          "weather-feels-like"
        ).textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
        document.getElementById(
          "weather-humidity"
        ).textContent = `${data.main.humidity}%`;
        document.getElementById("weather-wind").textContent = `${Math.round(
          data.wind.speed * 3.6
        )} km/h`;
        document.querySelector("#weather-widget small").style.display = "none"; // Hide instructions/warning

        // Save the successfully fetched city
        settings.weather.city = data.name;
        saveSettings();
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
        document.getElementById("weather-temp").textContent = "--°C";
        document.getElementById("weather-desc").textContent = "City Not Found";
        document.getElementById("weather-icon").textContent = "❓";
        document.querySelector("#weather-widget small").textContent =
          "(City not found)"; // Update small text
        document.querySelector("#weather-widget small").style.display = "block";
      });
  }

  function getWeatherIcon(iconCode) {
    const icons = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "⛅️",
      "02n": "☁️",
      "03d": "☁️",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌦️",
      "09n": "🌦️",
      "10d": "🌧️",
      "10n": "🌧️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "❄️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    };
    return icons[iconCode] || "❓";
  }
  // fetchWeather(); // Moved to INITIAL LOAD

  // Function to trigger weather fetch from input
  function searchWeatherFromInput() {
    const newCity = weatherCityInput.value.trim();
    if (newCity) {
      fetchWeather(newCity);
      weatherCityInput.blur();
    }
  }

  // Event listener for the city input (Enter key)
  weatherCityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchWeatherFromInput();
    }
  });

  // NEW: Event listener for the search button click
  weatherSearchBtn.addEventListener("click", () => {
    searchWeatherFromInput();
  });

  // ======== NOTES WIDGET ========
  // ... (unchanged) ...
  const notesTextarea = document.getElementById("notes-textarea");
  notesTextarea.addEventListener("input", (e) => {
    settings.notes = e.target.value;
    saveSettings();
  });

  // ======== SHORTCUTS ========
  // ... (unchanged - includes renderShortcuts, addDragAndDropListeners, form submit, delete click) ...
  const shortcutsGrid = document.getElementById("shortcuts-grid");
  const shortcutList = document.getElementById("shortcut-list");
  const addShortcutForm = document.getElementById("add-shortcut-form");
  let draggedIndex = null;
  function renderShortcuts() {
    shortcutsGrid.innerHTML = "";
    shortcutList.innerHTML = "";
    settings.shortcuts.forEach((shortcut, index) => {
      const link = document.createElement("a");
      link.href = shortcut.url;
      link.className = "shortcut-item";
      link.target = "_blank";
      link.innerHTML = `<img src="${shortcut.icon}" alt="${shortcut.name} icon" class="shortcut-icon" onerror="this.src='https://www.google.com/s2/favicons?domain=google.com&sz=64'"><span class="shortcut-name">${shortcut.name}</span>`;
      shortcutsGrid.appendChild(link);
      const li = document.createElement("li");
      li.className = "shortcut-list-item";
      li.draggable = true;
      li.dataset.index = index;
      li.innerHTML = `<span class="shortcut-info"><i class='bx bx-menu move-handle'></i><img src="${shortcut.icon}" alt="" width="24" height="24">${shortcut.name}</span><button class="delete-shortcut-btn" data-index="${index}">Delete</button>`;
      shortcutList.appendChild(li);
    });
    addDragAndDropListeners();
  }
  function addDragAndDropListeners() {
    const items = document.querySelectorAll(".shortcut-list-item");
    items.forEach((item) => {
      item.addEventListener("dragstart", (e) => {
        draggedIndex = parseInt(item.dataset.index, 10);
        item.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
      });
      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        const targetIndex = parseInt(item.dataset.index, 10);
        if (draggedIndex !== targetIndex) {
          item.classList.add("drag-over");
        }
        e.dataTransfer.dropEffect = "move";
      });
      item.addEventListener("dragleave", (e) => {
        item.classList.remove("drag-over");
      });
      item.addEventListener("drop", (e) => {
        e.preventDefault();
        item.classList.remove("drag-over");
        const targetIndex = parseInt(item.dataset.index, 10);
        if (draggedIndex !== null && draggedIndex !== targetIndex) {
          const [draggedShortcut] = settings.shortcuts.splice(draggedIndex, 1);
          settings.shortcuts.splice(targetIndex, 0, draggedShortcut);
          saveSettings();
          renderShortcuts();
        }
      });
      item.addEventListener("dragend", (e) => {
        items.forEach((i) => {
          i.classList.remove("dragging");
          i.classList.remove("drag-over");
        });
        draggedIndex = null;
      });
    });
  }
  addShortcutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("shortcut-name").value;
    const url = document.getElementById("shortcut-url").value;
    let icon = document.getElementById("shortcut-icon").value;
    if (!icon) {
      try {
        const domain = new URL(url).hostname;
        icon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      } catch (error) {
        console.error("Invalid URL for icon fetching:", url);
        icon = "https://www.google.com/s2/favicons?domain=google.com&sz=64";
      }
    }
    settings.shortcuts.push({ name, url, icon });
    saveSettings();
    renderShortcuts();
    addShortcutForm.reset();
  });
  shortcutList.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-shortcut-btn");
    if (deleteBtn) {
      const index = parseInt(deleteBtn.dataset.index, 10);
      settings.shortcuts.splice(index, 1);
      saveSettings();
      renderShortcuts();
    }
  });

  // ======== SETTINGS MODAL ========
  // ... (unchanged) ...
  const modal = document.getElementById("settings-modal");
  const settingsBtn = document.getElementById("settings-btn");
  const closeBtn = document.querySelector(".close-btn");
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");
  settingsBtn.onclick = () => (modal.style.display = "block");
  closeBtn.onclick = () => (modal.style.display = "none");
  window.onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  };
  tabLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const tabId = link.dataset.tab;
      tabContents.forEach((content) => content.classList.remove("active"));
      tabLinks.forEach((l) => l.classList.remove("active"));
      document.getElementById(tabId).classList.add("active");
      link.classList.add("active");
    });
  });
  document
    .getElementById("wallpaper-upload")
    .addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          settings.wallpaper.url = event.target.result;
          applySettings();
          saveSettings();
        };
        reader.readAsDataURL(file);
      }
    });
  document.getElementById("wallpaper-url-btn").addEventListener("click", () => {
    const url = document.getElementById("wallpaper-url").value;
    if (url) {
      settings.wallpaper.url = url;
      applySettings();
      saveSettings();
      document.getElementById("wallpaper-url").value = "";
    }
  });
  document.getElementById("bg-size").addEventListener("change", (e) => {
    settings.wallpaper.size = e.target.value;
    applySettings();
    saveSettings();
  });
  document.getElementById("bg-pos").addEventListener("change", (e) => {
    settings.wallpaper.position = e.target.value;
    applySettings();
    saveSettings();
  });

  // ** Layout Settings (Sliders) **
  // ... (unchanged - includes addSliderListener and listeners) ...
  function addSliderListener(id, valueId, settingKey) {
    const slider = document.getElementById(id);
    if (!slider) {
      console.warn(`Slider element with id "${id}" not found.`);
      return;
    }
    const valueDisplay = document.getElementById(valueId);
    if (!valueDisplay && id !== "content-position") {
      console.warn(`Value display element with id "${valueId}" not found.`);
    }
    slider.addEventListener("input", (e) => {
      const value = e.target.value;
      settings.layout[settingKey] = value;
      if (valueDisplay) valueDisplay.textContent = value;
      const root = document.documentElement;
      if (id === "time-size")
        root.style.setProperty("--time-font-size", `${value}rem`);
      if (id === "search-width")
        root.style.setProperty("--search-bar-width", `${value}px`);
      if (id === "icon-size")
        root.style.setProperty("--icon-size", `${value}px`);
      if (id === "icons-per-column" || id === "rows-per-column")
        root.style.setProperty("--grid-icons-per-column", value);
      if (id === "columns-per-row" || id === "icons-per-row")
        root.style.setProperty("--grid-columns", value);
      if (id === "col-gap")
        root.style.setProperty("--grid-col-gap", `${value}px`);
      if (id === "row-gap")
        root.style.setProperty("--grid-row-gap", `${value}px`);
    });
    slider.addEventListener("change", () => {
      saveSettings();
    });
  }
  addSliderListener("time-size", "time-size-val", "timeSize");
  addSliderListener("search-width", "search-width-val", "searchWidth");
  addSliderListener("icon-size", "icon-size-val", "iconSize");
  addSliderListener(
    "icons-per-column",
    "icons-per-column-val",
    "iconsPerColumn"
  );
  addSliderListener("rows-per-column", "rows-per-column-val", "iconsPerColumn");
  addSliderListener("columns-per-row", "columns-per-row-val", "columnsPerRow");
  addSliderListener("icons-per-row", "icons-per-row-val", "columnsPerRow");
  addSliderListener("col-gap", "col-gap-val", "colGap");
  addSliderListener("row-gap", "row-gap-val", "rowGap");
  document
    .getElementById("content-position")
    .addEventListener("change", (e) => {
      settings.layout.contentPosition = e.target.value;
      applySettings();
      saveSettings();
    });
  const resetLayoutBtn = document.getElementById("reset-layout-btn");
  if (resetLayoutBtn) {
    resetLayoutBtn.addEventListener("click", () => {
      settings.layout = JSON.parse(JSON.stringify(defaultSettings.layout));
      saveSettings();
      applySettings();
    });
  }

  // ======== TIME FORMAT TOGGLES ========
  // ... (unchanged) ...
  const timeFormatToggle = document.getElementById("time-format-toggle");
  const timeAmPmToggle = document.getElementById("time-ampm-toggle");
  const timeAmPmRow = document.getElementById("time-ampm-row");
  if (timeFormatToggle && timeAmPmToggle && timeAmPmRow) {
    function updateAmPmToggleState() {
      if (settings.time.hour12) {
        timeAmPmRow.classList.remove("disabled");
      } else {
        timeAmPmRow.classList.add("disabled");
      }
    }
    timeFormatToggle.addEventListener("change", (e) => {
      settings.time.hour12 = !e.target.checked;
      updateAmPmToggleState();
      updateTime();
      saveSettings();
    });
    timeAmPmToggle.addEventListener("change", (e) => {
      settings.time.showAmPm = e.target.checked;
      updateTime();
      saveSettings();
    });
  }

  // ======== INITIAL LOAD ========
  loadSettings();
  // Fetch weather for the initially loaded city AFTER settings are applied
  fetchWeather(settings.weather.city);

  // ======== GOOGLE SEARCH HIJACK ========
  // ... (unchanged) ...
  let hijackFlags = { form: false, suggestions: false };
  setupSearchInputListener(hijackFlags);
});

/**
 * Finds the Google CSE components and attaches listeners to "hijack" the search.
 */
// ... (unchanged) ...
function setupSearchInputListener(flags) {
  const searchInput = document.querySelector("input.gsc-input");
  const searchForm = document.querySelector("form.gsc-search-box");
  const searchButton = document.querySelector("button.gsc-search-button");
  const suggestionContainer = document.querySelector(
    ".gsc-completion-container"
  );
  const performCustomSearch = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const freshInput = document.querySelector("input.gsc-input");
    if (!freshInput) return false;
    const currentValue = freshInput.value;
    if (currentValue) {
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(
        currentValue
      )}`;
      window.open(googleUrl, "_blank");
      console.log(`Redirecting to Google search for: ${currentValue}`);
      freshInput.value = "";
    }
    return false;
  };
  if (searchInput && searchForm && searchButton && !flags.form) {
    console.log("Search form/input/button found. Attaching listeners.");

const funnyPlaceholders = [
  'Look up "Why my cat plots my demise"',
  'Search "is water really wet"',
  'Find "Easy ways to look busy"',
  'I am Groot?',
  'Where did I leave my keys?',
  'Ask me anything... almost.',
  'Search your feelings.'
];

const randomPlaceholder = funnyPlaceholders[Math.floor(Math.random() * funnyPlaceholders.length)];



       searchInput.placeholder = randomPlaceholder;
    searchForm.addEventListener("submit", performCustomSearch);
    searchButton.addEventListener("click", performCustomSearch);
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        performCustomSearch(event);
      }
    });
    flags.form = true;
  }
  if (suggestionContainer && !flags.suggestions) {
    console.log("Suggestion container found. Attaching click listener.");
    suggestionContainer.addEventListener("click", (event) => {
      setTimeout(() => {
        performCustomSearch(event);
      }, 50);
    });
    flags.suggestions = true;
  }
  if (!flags.form || !flags.suggestions) {
    setTimeout(() => setupSearchInputListener(flags), 500);
  } else {
    console.log("All search components found and hijacked.");
  }
}



