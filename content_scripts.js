console.log("Content script loaded");

chrome.storage.local.get(['filterEnabled']).then((response) => {
  if (response.filterEnabled) {
    console.log('Filter enabled');
    chrome.storage.local.get(['blacklist', 'whitelist']).then((response) => {
      if (!response || !response.blacklist || !response.whitelist) {
        console.error("Invalid response received for blacklist/whitelist");
        console.log(whitelist);
        console.log(blacklist);
        return;
      }

      const blacklist = new Set(response.blacklist);
      const whitelist = new Set(response.whitelist);
      console.log("Blacklist:", blacklist);
      console.log("Whitelist:", whitelist);
      const searchResults = document.querySelectorAll('.tF2Cxc');  // Google
      searchResults.forEach(result => {
        try {
          const link = result.querySelector('a[href]:not([href^="#"])');
          if (!link) {
            return;
          }
          const href = link.href;
          const domain = new URL(href).hostname;

          if (blacklist.has(domain)) {
            result.parentElement.style.display = 'none';
          }

          if (whitelist.has(domain)) {
            link.style.border = '2px solid #00ff00';
            link.style.padding = '2px';
          }
        } catch (error) {
          console.error("Error processing search result:", error);
        }
      });

      const allLinks = document.querySelectorAll('a[href]:not([href^="#"])');
      allLinks.forEach(link => {
        try {
          const href = link.href;
          const domain = new URL(href).hostname;

          if (blacklist.has(domain)) {
            link.parentElement.style.display = 'none';
          }
          if (whitelist.has(domain)) {
            link.style.border = '2px solid #00ff00';
            link.style.padding = '2px';
          }
        } catch (error) {
          console.error("Error processing link:", error);
        }
      });

    });
  } else {
    console.log("Filter is disabled");
  }
}).catch((error) => {
  console.error("Error accessing storage:", error);
});

