document.addEventListener('DOMContentLoaded', (event) => {
  const selectElement = document.getElementById("lastUpdate");
  const savedValue = localStorage.getItem('lastUpdate');
  
  if (savedValue) {
    selectElement.value = savedValue;
  } else {
    selectElement.value = "Option1";
  }

  selectElement.addEventListener('change', function() {
    const update1 = selectElement.value;
    localStorage.setItem('lastUpdate', update1);
    console.log('Last Update:', update1);
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