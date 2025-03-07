document.addEventListener('DOMContentLoaded', (event) => {
  const selectElement = document.getElementById("lastUpdate");
  const savedValue = localStorage.getItem('lastUpdate');
  
  // Set the initial value to "anytime" if no value is saved
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
  let query = 'https://www.google.com/search?as_q=' + encodeURIComponent(searchInput);
  if (lastUpdate) query += `&tbs=${lastUpdate}`;

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.update(tabs[0].id, { url: query });
  });
  console.log("Updated");
});