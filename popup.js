document.addEventListener('DOMContentLoaded', (event) => {
  const selectElement = document.getElementById("lastUpdate");
  const countryElement = document.getElementById("country");
  const fileTypeElement = document.getElementById("fileType");
  const searchInputElement = document.getElementById("searchInput");

  const savedLastUpdate = localStorage.getItem('lastUpdate');
  const savedCountry = localStorage.getItem('country');
  const savedFileType = localStorage.getItem('fileType');
  const savedSearchInput = localStorage.getItem('searchInput');
  
  if (savedLastUpdate) {
    selectElement.value = savedLastUpdate;
  } else {
    selectElement.value = "";
  }

  if (savedCountry) {
    countryElement.value = savedCountry;
  } else {
    countryElement.value = "";
  }

  if (savedFileType) {
    fileTypeElement.value = savedFileType;
  } else {
    fileTypeElement.value = "";
  }

  if (savedSearchInput) {
    searchInputElement.value = savedSearchInput;
  } else {
    searchInputElement.value = "";
  }

  selectElement.addEventListener('change', function() {
    const update1 = selectElement.value;
    localStorage.setItem('lastUpdate', update1);
    console.log('Last Update:', update1);
  });

  countryElement.addEventListener('change', function() {
    const country = countryElement.value;
    localStorage.setItem('country', country);
    console.log('Country:', country);
  });

  fileTypeElement.addEventListener('change', function() {
    const fileType = fileTypeElement.value;
    localStorage.setItem('fileType', fileType);
    console.log('File Type:', fileType);
  });

  searchInputElement.addEventListener('input', function() {
    const searchInput = searchInputElement.value;
    localStorage.setItem('searchInput', searchInput);
    console.log('Search Input:', searchInput);
  });
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

document.addEventListener('DOMContentLoaded', function () {
  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl, {
          container: 'body' // ✅ Fix for Chrome extensions
      });
  });
});
