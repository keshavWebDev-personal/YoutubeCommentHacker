let gloVar = {
    minTime: 0,
    maxTime:0,
}

const methods = {
    sendMessage: (message, expectedResponse) => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (!expectedResponse) { return }
                if (response[expectedResponse]) {
                    resolve(response)
                } else if (response.error) {
                    reject(response.error)
                } else {
                    reject("'" + expectedResponse + "' not recieved")
                }
            })
        })
    },
}

// ---------------------Global Event Listners-------------------------- 

//To Store Mintime Maxtime Values from Popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>{
    if (message.sender == 'popup_script' && message.action == "Store Min Max Time values") {
        gloVar.maxTime = message.data.maxTime
        gloVar.minTime = message.data.minTime
        sendResponse("Received by Background_Script")
    }
})

// send min max time to content script on request
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action == "get minTime maxTime" && message.sender == "content_script" ) {
        
        sendResponse({ minTime: gloVar.minTime, maxTime: gloVar.maxTime })
        
    }
})
