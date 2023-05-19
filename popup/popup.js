let minTime = document.getElementById('minTime')
let maxTime = document.getElementById('maxTime')

// to send message to content script to show the controls in the Webpage

document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "Show Controls on webPage"
        })
        chrome.runtime.sendMessage({ action: "store_minTime", data: minTime.value})
        chrome.runtime.sendMessage({ action: "store_maxTime", data: maxTime.value})
    })
});

minTime.addEventListener('input', () => {
    chrome.runtime.sendMessage({ action: "store_minTime", data: minTime.value})
})
maxTime.addEventListener('input', () => {
    chrome.runtime.sendMessage({ action: "store_maxTime", data: maxTime.value})
})    