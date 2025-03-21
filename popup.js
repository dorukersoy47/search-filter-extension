document.addEventListener('DOMContentLoaded', () => {
  const selectElement = document.getElementById("lastUpdate");
  const countryElement = document.getElementById("country");
  const fileTypeElement = document.getElementById("fileType");
  const searchInputElement = document.getElementById("searchInput");
  const blacklistSelect = document.getElementById('blacklistInput');
  const whitelistSelect = document.getElementById('whitelistInput');
  const filterToggle = document.getElementById('filterToggle');
  const whitelistFileNameSpan = document.getElementById('whitelistFileName');
  const blacklistFileNameSpan = document.getElementById('blacklistFileName');

  chrome.storage.local.get([
    'lastUpdate', 'country', 'fileType', 'searchInput', 
    'filterEnabled', 'blacklist', 'whitelist', 
    "blacklistFileName", "whitelistFileName"
  ]).then((data) => {
    selectElement.value = data.lastUpdate || "";
    countryElement.value = data.country || "";
    fileTypeElement.value = data.fileType || "";
    searchInputElement.value = data.searchInput || "";
    filterToggle.checked = data.filterEnabled || false;
    // blacklistSelect.value = data.blacklistFileName || "";
    // whitelistSelect.value = data.whitelistFileName || "";
    whitelistFileNameSpan.textContent = data.whitelistFileName || "No file loaded";
    blacklistFileNameSpan.textContent = data.blacklistFileName || "No file loaded";
  }).catch((error) => {
    console.error("Error loading settings:", error);
  });

  const handleFileInput = (event, storageKey, fileNameKey, fileNameSpan) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        const list = contentToList(fileContent);
        chrome.storage.local.set({ [storageKey]: list, [fileNameKey]: file.name });
        fileNameSpan.textContent = file.name;
      };
      reader.readAsText(file);
    } else {
      event.target.value = ''; // Reset the input
      fileNameSpan.textContent = "Invalid file";
      console.error("Invalid file selected. Please choose a valid .txt file.");
    }
  };

  whitelistSelect.addEventListener('change', (event) => handleFileInput(event, 'whitelist', 'whitelistFileName', whitelistFileNameSpan));
  blacklistSelect.addEventListener('change', (event) => handleFileInput(event, 'blacklist', 'blacklistFileName', blacklistFileNameSpan));

  filterToggle.addEventListener('change', function() {
    const filterEnabled = filterToggle.checked;
    chrome.storage.local.set({'filterEnabled': filterEnabled});
    console.log('Filter Enabled:', filterEnabled);
  });

  selectElement.addEventListener('change', function() {
    const update1 = selectElement.value;
    chrome.storage.local.set({'lastUpdate': update1});
    console.log('Last Update:', update1);
  });

  countryElement.addEventListener('change', function() {
    const country = countryElement.value;
    chrome.storage.local.set({'country': country});
    console.log('Country:', country);
  });

  fileTypeElement.addEventListener('change', function() {
    const fileType = fileTypeElement.value;
    chrome.storage.local.set({'fileType': fileType});
    console.log('File Type:', fileType);
  });

  searchInputElement.addEventListener('input', function() {
    const searchInput = searchInputElement.value;
    chrome.storage.local.set({'searchInput': searchInput});
    console.log('Search Input:', searchInput);
  });

  document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInput = document.getElementById("searchInput").value;
    const lastUpdate = document.getElementById("lastUpdate").value;
    const country = document.getElementById("country").value;
    const fileType = document.getElementById("fileType").value;
    let query = 'https://www.google.com/search?as_q=' + encodeURIComponent(searchInput);
    if (lastUpdate) query += `&tbs=${lastUpdate}`;
    if (country) query += `&cr=${country}`;
    if (fileType) query += `&as_filetype=${fileType}`;

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url: query });
    });
    console.log("Updated");  
  });

  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl, {
          container: 'body' // ✅ Fix for Chrome extensions
      });
  });
});

function contentToList(content) {
  return content.split('\n').map(line => line.trim()).filter(line => line);
}

