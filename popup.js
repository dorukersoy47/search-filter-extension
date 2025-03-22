document.addEventListener('DOMContentLoaded', () => {
  const selectElement = document.getElementById("lastUpdate")
  const countryElement = document.getElementById("country")
  const fileTypeElement = document.getElementById("fileType")
  const searchInputElement = document.getElementById("searchInput")
  const languageElement = document.getElementById("language")
  const filterToggle = document.getElementById("filterToggle")
  const whitelistSelect = document.getElementById("whitelistInput")
  const blacklistSelect = document.getElementById("blacklistInput")
  const whitelistFileNameSpan = document.getElementById("whitelistFileName")
  const blacklistFileNameSpan = document.getElementById("blacklistFileName")
  const savedSettingsSelect = document.getElementById("savedSettingsSelect")
  const saveSettingsButton = document.getElementById("saveSettingsButton")
  const loadSettingsButton = document.getElementById("loadSettingsButton")

  chrome.storage.local.get(["savedSettings"]).then((data) => {
    const savedSettings = data.savedSettings || []
    savedSettingsSelect.innerHTML = ""
    savedSettings.forEach((setting, index) => {
      const option = document.createElement("option")
      option.value = index
      option.textContent = setting.name
      savedSettingsSelect.appendChild(option)
    })
  })

  saveSettingsButton.addEventListener("click", () => {
    const profileName = prompt("Enter a name for these settings:")
    if (!profileName) {
      return
    }
    const settings = {
      name: profileName,
      lastUpdate: selectElement.value,
      country: countryElement.value,
      fileType: fileTypeElement.value,
      searchInput: searchInputElement.value,
      language: languageElement.value,
      filterEnabled: filterToggle.checked
    }
    chrome.storage.local.get(["savedSettings"]).then((data) => {
      const savedSettings = data.savedSettings || []
      savedSettings.push(settings)
      chrome.storage.local.set({ savedSettings }).then(() => {
        const option = document.createElement("option")
        option.value = savedSettings.length - 1
        option.textContent = settings.name
        savedSettingsSelect.appendChild(option)
        savedSettingsSelect.value = savedSettings.length - 1
      })
    })
  })

  loadSettingsButton.addEventListener("click", () => {
    const selectedIndex = savedSettingsSelect.value
    if (selectedIndex === "") {
      return
    }
    chrome.storage.local.get(["savedSettings"]).then((data) => {
      const savedSettings = data.savedSettings || []
      const settings = savedSettings[selectedIndex]
      if (!settings) return
      selectElement.value = settings.lastUpdate || ""
      countryElement.value = settings.country || ""
      fileTypeElement.value = settings.fileType || ""
      searchInputElement.value = settings.searchInput || ""
      languageElement.value = settings.language || ""
      filterToggle.checked = settings.filterEnabled || false
    })
  })

  chrome.storage.local.get([
    "lastUpdate",
    "country",
    "fileType",
    "searchInput",
    "language",
    "filterEnabled",
    "blacklistFileName",
    "whitelistFileName"
  ]).then((data) => {
    selectElement.value = data.lastUpdate || ""
    countryElement.value = data.country || ""
    fileTypeElement.value = data.fileType || ""
    searchInputElement.value = data.searchInput || ""
    languageElement.value = data.language || ""
    filterToggle.checked = data.filterEnabled || false
    whitelistFileNameSpan.textContent = data.whitelistFileName || "No file loaded"
    blacklistFileNameSpan.textContent = data.blacklistFileName || "No file loaded"
  }).catch((error) => {
    console.error("Error loading settings:", error)
  })

  const handleFileInput = (event, storageKey, fileNameKey, fileNameSpan) => {
    const file = event.target.files[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const fileContent = e.target.result
        const list = contentToList(fileContent)
        chrome.storage.local.set({ [storageKey]: list, [fileNameKey]: file.name })
        fileNameSpan.textContent = file.name
      }
      reader.readAsText(file)
    } else {
      event.target.value = ""
      fileNameSpan.textContent = "Invalid file"
      console.error("Invalid file selected. Please choose a valid .txt file.")
    }
  }

  whitelistSelect.addEventListener("change", (event) => handleFileInput(event, "whitelist", "whitelistFileName", whitelistFileNameSpan))
  blacklistSelect.addEventListener("change", (event) => handleFileInput(event, "blacklist", "blacklistFileName", blacklistFileNameSpan))

  filterToggle.addEventListener("change", function() {
    const filterEnabled = filterToggle.checked
    chrome.storage.local.set({ filterEnabled })
    console.log("Filter Enabled:", filterEnabled)
  })

  selectElement.addEventListener("change", function() {
    const updateValue = selectElement.value
    chrome.storage.local.set({ lastUpdate: updateValue })
    console.log("Last Update:", updateValue)
  })

  countryElement.addEventListener("change", function() {
    const country = countryElement.value
    chrome.storage.local.set({ country })
    console.log("Country:", country)
  })

  fileTypeElement.addEventListener("change", function() {
    const fileType = fileTypeElement.value
    chrome.storage.local.set({ fileType })
    console.log("File Type:", fileType)
  })

  searchInputElement.addEventListener("input", function() {
    const searchInput = searchInputElement.value
    chrome.storage.local.set({ searchInput })
    console.log("Search Input:", searchInput)
  })

  languageElement.addEventListener("change", function() {
    const language = languageElement.value
    chrome.storage.local.set({ language })
    console.log("Language:", language)
  })

  document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault()
    const searchInput = searchInputElement.value
    const lastUpdate = selectElement.value
    const country = countryElement.value
    const fileType = fileTypeElement.value
    const language = languageElement.value
    let query = "https://www.google.com/search?as_q=" + encodeURIComponent(searchInput)
    if (lastUpdate) query += `&tbs=${lastUpdate}`
    if (country) query += `&cr=${country}`
    if (fileType) query += `&as_filetype=${fileType}`
    if (language) query += `&lr=${language}`
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url: query })
    })
    console.log("Updated with advanced search query")
  })

  function contentToList(content) {
    return content.split("\n").map(line => line.trim()).filter(line => line)
  }
})

document.addEventListener('DOMContentLoaded', function () {
  // Initialize Bootstrap popovers
  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.forEach(function (popoverTriggerEl) {
      new bootstrap.Popover(popoverTriggerEl, {
          container: 'body',
          trigger: 'hover' // Change to 'click' if needed
      });
  });
});
