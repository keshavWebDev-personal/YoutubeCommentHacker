export function backend() {
    const gloVar = {
        minTimeLimit: 1000,
        maxTimeLimit: 10000
    }
    const DOMElements = {
        minTime: document.getElementById('minTimeSlider'),
        maxTime: document.getElementById('maxTimeSlider'),
        countBox: document.getElementById("Count"),
        commentStartTime: document.getElementById('commentStartTime'),
    }
    const methods = {
        logSuccess: (msg)=>{
            console.log('%c' + msg, 'background-color: #e8ffe6');
        },
        sendToContentScript: function (tabId, message, expectedResponse) {
            return new Promise((resolve, reject) => {
                chrome.tabs.sendMessage(tabId, message, (response) => {
                    if (typeof response === "undefined") {
                        reject("'" + expectedResponse + "' from Content Script not recieved")
                    } else if (response[expectedResponse]) {
                        resolve(response)
                    } else if (response.error) {
                        reject(response.error)
                    } else {
                        reject("A imProper Response was recived")
                    }
                })
            })
        },
        sendToBgScript: function (message, expectedResponse) {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(message, (response) => {
                    if (typeof response === "undefined") {
                        reject("'" + expectedResponse + "' from Content Script not recieved")
                    } else if (response[expectedResponse]) {
                        resolve(response)
                    } else if (response.error) {
                        reject(response.error)
                    } else {
                        reject("A imProper Response was recived")
                    }
                })
            })
        },
        getCurrentMinValue: () => {
            return (DOMElements.minTime.value * ((gloVar.maxTimeLimit - gloVar.minTimeLimit) / 100)) + gloVar.minTimeLimit
        },
        getCurrentMaxValue: () => {
            return (DOMElements.maxTime.value * ((gloVar.maxTimeLimit - gloVar.minTimeLimit) / 100)) + gloVar.minTimeLimit
        }
    }

    //********************** Event Listners **************************

    document.addEventListener('DOMContentLoaded', function () {
        // to send message to content script to show the controls in the Webpage
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            methods.sendToContentScript(tabs[0].id, { action: "Show Controls on webPage" }, "received").catch((error) => {
                console.error(error);
            })

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

        //send min max time values to background script
        methods.sendToBgScript({
            sender: "popup_script",
            action: "Store Min Max Time values",
            data: {
                minTime: methods.getCurrentMinValue(),
                maxTime: methods.getCurrentMaxValue()
            }
        }, "Received by Background_Script").then((response)=>{
            methods.logSuccess(response)
        }).catch((err)=>{
            console.error(err);
        })
        
    });

    //Send Min Max Time values to content script on input
    DOMElements.minTime.addEventListener('input', () => {
        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
                methods.sendToContentScript(tab.id, { action: "store_minTime", data: methods.getCurrentMinValue() }, "Received").then(response => {
                    methods.logSuccess(response)
                }).catch(err => {
                    console.error(err);
                })

            });
        })
    })

    DOMElements.maxTime.addEventListener('input', () => {
        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
                methods.sendToContentScript(tab.id, { action: "store_maxTime", data: methods.getCurrentMaxValue() }, "Received").then(response => {
                    methods.logSuccess(response)
                }).catch(err => {
                    console.error(err);
                })

            });
        })
    })

    // Listen for Min Max time from content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action == "get minTime maxTime" && message.sender == "background_script") {
            sendResponse({ minTime: methods.getCurrentMinValue(), maxTime: methods.getCurrentMaxValue() })
        }
    })

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