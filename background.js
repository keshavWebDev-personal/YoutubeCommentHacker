chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let minTime = 3000
    let maxTime = 10000

    if (request.action === "store_minTime") {
        minTime = request.data

    } else if (request.action === "store_maxTime") {
        maxTime = request.data

    } else if (request.action === "get minTime maxTime") {
        sendResponse({ minTime: minTime, maxTime: maxTime })

    }
});

// // Set default values for minTime and maxTime
// chrome.storage.local.set({ minTime: 5000, maxTime: 30000 });

// // Listen for messages
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   // Retrieve the stored values of minTime and maxTime
//   chrome.storage.local.get(["minTime", "maxTime"], (result) => {
//     let minTime = result.minTime;
//     let maxTime = result.maxTime;

//     if (request.action === "store_minTime") {
//       // Store the new value of minTime in chrome.storage
//       minTime = request.data;
//       chrome.storage.local.set({ minTime: minTime });
//     } else if (request.action === "store_maxTime") {
//       // Store the new value of maxTime in chrome.storage
//       maxTime = request.data;
//       chrome.storage.local.set({ maxTime: maxTime });
//     } else if (request.action === "get minTime maxTime") {
//       // Send the values of minTime and maxTime to the caller
//       console.log(minTime, maxTime);
//       sendResponse({ minTime: minTime, maxTime: maxTime });
//     }
//   });

//   // Make sure to return true so that sendResponse can be called asynchronously
//   return true;
// });