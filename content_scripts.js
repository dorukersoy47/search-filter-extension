console.log("Content script loaded"); 

function filterSearchResults(blockWord){
    const results = document.querySelectorAll("div.g");
    results.forEach((item) => {
        if(blockWord && item.innerText.toLowerCase().includes(blockWord.toLowerCase())){
            item.style.display = "none";
        }
    });
}