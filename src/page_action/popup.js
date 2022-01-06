// Initialize button with user's preferred color

// When the button is clicked, inject setPageBackgroundColor into current page
clearButton.addEventListener("click", async () => {
    chrome.storage.sync.clear()
});
suggestion.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scrollSuggest,
    });
})




// The body of this function will be executed as a content script inside the
// current page
function scrollSuggest() {
  
    var sugglink=document.body.getElementsByClassName("suggestion")[0];
    sugglink.scrollIntoView();
}

