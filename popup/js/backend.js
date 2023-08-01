export function backend() {
    const DOMElements = {
        minTime: document.getElementById('minTimeSlider'),
        maxTime: document.getElementById('maxTimeSlider'),
        countBox: document.getElementById("Count"),
        commentStartTime: document.getElementById('commentStartTime'),
    }
    const methods = {
        sendToContentScript: function (tabId, message, expectedResponse) {
            return new Promise((resolve, reject) => {
                chrome.tabs.sendMessage(tabId, message, (response) => {
                    if (typeof response === "undefined") {
                        reject("'" + expectedResponse + "' from Content Script not recieved")
                    } else if (response[expectedResponse]) {
                        resolve(response)
                    } else if (response.error) {
                        reject(response.error)
                    } else{
                        reject("A imProper Response was recived")
                    }
                })
            })
        }
    }
    // to send message to content script to show the controls in the Webpage

    document.addEventListener('DOMContentLoaded', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            methods.sendToContentScript(tabs[0].id, { action: "Show Controls on webPage" }, "received").catch((error) => {
                console.error(error);
            })

            // chrome.tabs.sendMessage(tabs[0].id, { action: "store_minTime", data: DOMElements.minTime.value })
            // chrome.tabs.sendMessage(tabs[0].id, { action: "store_maxTime", data: DOMElements.maxTime.value })

            methods.sendToContentScript(tabs[0].id, { request: "give_commentStartTime" }, "commentStartTime").then((response) => {
                DOMElements.commentStartTime.textContent = response.commentStartTime
            }).catch((error) => {
                console.error(error);
            })
        })

        //get current commets done count
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                if (tab.url.includes("youtube.com") || tab.url.includes("youtu.be")) {
                    methods.sendToContentScript(tab.id, { request: "give_currentCmntsCount" }, "commentInterval").then((response) => {
                        DOMElements.countBox.textContent = parseInt(DOMElements.countBox.textContent) + response.commentInterval
                    }).catch((error) => {
                        console.error(error);
                    })
                }
            });
        })
    });

    // DOMElements.minTime.addEventListener('input', () => {
    //     chrome.runtime.sendMessage({ action: "store_minTime", data: DOMElements.minTime.value })
    // })
    // DOMElements.maxTime.addEventListener('input', () => {
    //     chrome.runtime.sendMessage({ action: "store_maxTime", data: DOMElements.maxTime.value })
    // })


    //Listens for Commments Done Count from content_script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.isCommentDone) {
            DOMElements.countBox.textContent = parseInt(DOMElements.countBox.textContent) + 1
            sendResponse("'isCommentDone' Recieved by Popup")
        }
    })

    let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.intervalStartTime) {
            DOMElements.commentStartTime.textContent = message.intervalStartTime
        }
    })
}