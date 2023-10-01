class ExtManager {
    static sendToPopup(message: object, expectedResponse: string | undefined) {
        return new Promise<object>((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (!expectedResponse) {
                    return;
                }
                if (response[expectedResponse]) {
                    resolve(response);
                } else if (response.error) {
                    reject(response.error);
                } else {
                    reject(
                        "'" + expectedResponse + "' from Popup not recieved"
                    );
                }
            });
        });
    }
    static fetchFiles(url: string) {
        return fetch(chrome.runtime.getURL(url)).then((response) =>
            response.text()
        );
    }
}

class UIHandler {
    controlsDiv: HTMLDivElement;
    button: HTMLButtonElement;
    styleElem: HTMLStyleElement | null;
    cmntsCount_title: HTMLParagraphElement;
    cmtsCount_display: HTMLSpanElement;
    cmntsCountDiv: HTMLDivElement;

    constructor() {
        this.controlsDiv = document.getElementById(
            "controlsDiv_commentHackerScript"
        ) as HTMLDivElement;

        this.button = document.getElementById(
            "button_commentHackerScript"
        ) as HTMLButtonElement;

        this.styleElem = null;
        this.cmntsCount_title = document.getElementById(
            "cmntsCount_title_commentHackerScript"
        ) as HTMLParagraphElement;

        this.cmtsCount_display = document.getElementById(
            "cmtsCount_display_commentHackerScript"
        ) as HTMLSpanElement;
        this.cmntsCountDiv = document.getElementById(
            "cmntsCountDiv_commentHackerScript"
        ) as HTMLDivElement;
    }

    toggleButtonState() {
        this.button.classList.add("animate");

        if (this.button.textContent == "Start") {
            this.button.textContent = "Stop";
        } else {
            this.button.textContent = "Start";
        }

        setTimeout(() => {
            this.button.classList.remove("animate");
        }, 600);

        setTimeout(() => {
            if (this.button.textContent == "Start") {
                this.button.parentNode?.style.setProperty(
                    "--bubbles_color",
                    "#20f020"
                );
            } else {
                this.button.parentNode?.style.setProperty(
                    "--bubbles_color",
                    "#f0203c"
                );
            }
        }, 300);
    }

    playMouseDownAudio() {
        let mouseDown_audio = document.createElement("audio");
        document.body.appendChild(mouseDown_audio);
        mouseDown_audio.src = chrome.runtime.getURL(
            "assets/audio/mouse_down.mp3"
        );
        mouseDown_audio.play();
    }
    playMouseUpAudio() {
        let mouseUp_audio = document.createElement("audio");
        document.body.appendChild(mouseUp_audio);
        mouseUp_audio.src = chrome.runtime.getURL("assets/audio/mouse_up.mp3");
        mouseUp_audio.play();
    }
    showControlsOnWebpage() {
        if (!this.controlsDiv) {
            //insert CSS
            ExtManager.fetchFiles("assets/commentBoxUi.css").then((css) => {
                this.styleElem = document.createElement("style");
                this.styleElem.innerHTML = css;
                document.head.appendChild(this.styleElem);

                // insert HTML
                ExtManager.fetchFiles("assets/commentBoxUi.html").then(
                    (html) => {
                        let wrapper = document.createElement("div");
                        let commentsSection_titleElem = document.querySelector(
                            "ytd-comments#comments #title"
                        );
                        wrapper.innerHTML = html;
                        commentsSection_titleElem?.appendChild(wrapper);

                        // Updating the DOMElems object

                        this.controlsDiv = document.getElementById(
                            "controlsDiv_commentHackerScript"
                        ) as HTMLDivElement;

                        this.button = document.getElementById(
                            "button_commentHackerScript"
                        ) as HTMLButtonElement;

                        this.styleElem = null;
                        this.cmntsCount_title = document.getElementById(
                            "cmntsCount_title_commentHackerScript"
                        ) as HTMLParagraphElement;

                        this.cmtsCount_display = document.getElementById(
                            "cmtsCount_display_commentHackerScript"
                        ) as HTMLSpanElement;
                        this.cmntsCountDiv = document.getElementById(
                            "cmntsCountDiv_commentHackerScript"
                        ) as HTMLDivElement;

                        //Adjust colors according to dark/light mode
                        this.colorsAccAppMode();

                        // If start button pressed
                        this.button.onmousedown = () => {
                            this.toggleButtonState();
                            Comments.toggleStart();
                            this.playMouseDownAudio();
                        };

                        this.button.onmouseup = () => {
                            this.playMouseUpAudio();
                        };
                    }
                );
            });
        }
    }
    colorsAccAppMode() {
        if (gloVar.isDarkMode == false) {
            // If light Mode
            //div styles
            this.controlsDiv.style.backgroundColor = "#0000000d";
            this.controlsDiv.style.setProperty(
                "--pseudo-background-image1",
                "conic-gradient(from 215deg , rgb(255 255 255 / 18%), rgba(0,0,0,0.2)75%)"
            );
            this.controlsDiv.style.setProperty(
                "--pseudo-background-image2",
                "conic-gradient(from 45deg , rgba(0,0,0,0.3), rgb(255 255 255 / 16%)30.4%)"
            );

            //button styles
            this.button.style.color = "black";
            this.button.style.boxShadow =
                "rgba(255, 255, 255, 0.9) -4px -4px 7px 1px, rgba(0, 0, 0, 0.3) 4px 4px 13px";
            this.button.style.textShadow = "";

            //count div styles
            this.cmntsCountDiv.style.backgroundColor = "hsl(0deg 0% 95.3%)";
            this.cmntsCountDiv.style.boxShadow =
                "rgba(255, 255, 255, 0.9) -4px -4px 7px 1px, rgba(0, 0, 0, 0.3) 4px 4px 13px";

            //count title styles
            this.cmntsCount_title.style.color = "black";
        } else {
            //if Dark Mode
            //div styles
            this.controlsDiv.style.color = "white";
            this.controlsDiv.style.setProperty(
                "--pseudo-background-image1",
                "conic-gradient(from 215deg , rgb(255 255 255 / 18%), black 75%)"
            );
            this.controlsDiv.style.setProperty(
                "--pseudo-background-image2",
                "conic-gradient(from 45deg , black, rgb(255 255 255 / 16%)96%)"
            );

            //count div
            this.cmntsCountDiv.style.backgroundColor = "#0F0F0F";
            this.cmntsCountDiv.style.boxShadow =
                "-5px -5px 8px rgb(255 255 255 / 11%), -16px -17px 13px rgb(255 256 255 / 2%), 5px 5px 13px rgb(0 0 0 / 101%)";

            //button
            this.button.style.color = "white";
            this.button.style.boxShadow =
                "-5px -5px 8px rgb(255 255 255 / 11%), -16px -17px 13px rgb(255 256 255 / 2%), 5px 5px 13px rgb(0 0 0 / 101%)";
            this.button.style.textShadow = "0 0 30px black";

            //count title
            this.cmntsCount_title.style.color = "white";
        }
    }
    hideControlsOnWebpage() {
        if (this.controlsDiv) {
            this.controlsDiv.remove();
        }
    }
}

class Comments {
    static toggleStart() {
        // Call sendMessage function to get minTime and maxTime values
        ExtManager.sendToPopup(
            { sender: "content_script", action: "get minTime maxTime" },
            "minTime"
        )
            .then((response) => {
                gloVar.minTime = response.minTime;
                gloVar.maxTime = response.maxTime;
                chrome.runtime.onMessage.addListener(
                    (request, sender, reponse) => {
                        if (request.action == "store_minTime") {
                            gloVar.minTime = request.data;
                        }
                        if (request.action == "store_maxTime") {
                            gloVar.maxTime = request.data;
                        }
                    }
                );

                Comments.startStopRandomInterval();
            })
            .catch((error) => {
                console.error(error);
            });
    }
    static startStopRandomInterval() {
        if (gloVar.intervalId) {
            clearInterval(gloVar.intervalId);
            clearTimeout(gloVar.intervalId); // clear the setTimeout as well
            gloVar.intervalId = null;
            console.log("Interval stopped");
        } else {
            console.log("Interval started");

            //send time started
            let commentStartTime = new Date()
                .toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                })
                .replace(/\s/g, "")
                .toLowerCase();

            ExtManager.sendToPopup(
                {
                    intervalStartTime: commentStartTime,
                },
                undefined
            );

            chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
                if (message.request == "give_commentStartTime") {
                    sendResponse({
                        commentStartTime: commentStartTime,
                    });
                }
            });
            Comments.runRandomInterval();
        }
    }
    static runRandomInterval() {
        let intervalTime =
            Math.floor(Math.random() * (gloVar.maxTime - gloVar.minTime)) +
            gloVar.minTime; // random interval time between minTime and maxTime

        gloVar.intervalId = setTimeout(() => {
            this.doComment();
            this.runRandomInterval();
        }, intervalTime);
    }
    static doComment() {
        fetch(
            "https://raw.githubusercontent.com/keshavWebDev-personal/commentsStacks/main/guruKaPattar/guruKaPattar_commentStack.json"
        )
            .then((response) => {
                if (!response.ok) {
                    fetch(
                        "https://raw.githack.com/keshavWebDev-personal/commentsStacks/main/guruKaPattar/guruKaPattar_commentStack.json"
                    ).then((response) => {
                        if (!response.ok) {
                            fetch(
                                "https://rawcdn.githack.com/keshavWebDev-personal/commentsStacks/e70a109fef5c01eb61ae4e5676216895fb147f27/guruKaPattar/guruKaPattar_commentStack.json"
                            ).then((response) => {
                                if (!response.ok) {
                                    throw new Error(
                                        "Network response was not ok"
                                    );
                                }
                                return response.json();
                            });
                        }
                        return response.json();
                    });
                }
                return response.json();
            })
            .then((commentsTextStack) => {
                let emojiStack = [
                    "\u{1F60A}", // Smiling Face With Smiling Eyes
                    "\u{1F642}", // Slightly Smiling Face
                    "\u{1F60C}", // Relieved Face
                    "\u{1F601}", // Grinning Face With Smiling Eyes
                    "\u{1F60D}", // Smiling Face With Heart-Eyes
                    "\u{1F618}", // Face Blowing a Kiss
                    "\u{1F60B}", // Face Savoring Food
                    "\u{1F64C}", // Person Raising Both Hands in Celebration
                    "\u{1F31F}", // Glowing Star
                    "\u{1F389}", // Party Popper
                    "\u{1F49C}", // Heart With Arrow
                    "\u{1F495}", // Two Hearts
                    "\u{1F44F}", // Clapping Hands Sign
                    "\u{1F525}", // Fire
                    "\u{1F4AF}", // Hundred Points Symbol
                    "\u{270C}", // Victory Hand
                    "\u{1F4AA}", // Flexed Biceps
                ];

                //Click on the Youtube Comment Boc Ui
                document.getElementById("placeholder-area")?.click();

                let emojiString = "";

                for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
                    emojiString =
                        emojiString +
                        emojiStack[
                            Math.floor(Math.random() * emojiStack.length)
                        ];
                }

                let finalText =
                    commentsTextStack[
                        Math.floor(Math.random() * commentsTextStack.length)
                    ] +
                    " " +
                    emojiString;

                document.getElementById("contenteditable-root")?.textContent =
                    finalText;
                document.getElementById("submit-button")?.click();
                gloVar.commentInterval++;
                document.querySelector(
                    "#cmntsCountDiv_commentHackerScript span"
                ).textContent = gloVar.commentInterval;

                //to send the current coment count to popup.js
                ExtManager.sendToPopup({ isCommentDone: true }, undefined);
            });
    }
}

class gloVarC {
    intervalId: null | number;
    isDarkMode: boolean;
    commentInterval: number;
    maxTime: number;
    minTime: number;
    constructor() {
        this.intervalId = null;
        (this.isDarkMode =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches),
            (this.commentInterval = 0);
        this.maxTime = 0;
        this.minTime = 0;
    }
}

let gloVar = new gloVarC();

let DOMElems = {
    controlsDiv: document.getElementById("controlsDiv_commentHackerScript"),
    button: document.getElementById("button_commentHackerScript"),
    styleElem: null,
    cmntsCount_title: document.getElementById(
        "cmntsCount_title_commentHackerScript"
    ),
    cmtsCount_display: document.getElementById(
        "cmtsCount_display_commentHackerScript"
    ),
    cmntsCountDiv: document.getElementById("cmntsCountDiv_commentHackerScript"),
};

// *********************Global Event Listners*********************

//Show Controls on webPage when Clicked on Extension Icon

const UIHandler1 = new UIHandler();
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "Show Controls on webPage") {
        UIHandler1.showControlsOnWebpage();
        sendResponse({ received: true });
    }
});

//to send cmnts count on reqest
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.request == "give_currentCmntsCount") {
        if (gloVar.commentInterval) {
            sendResponse({ commentInterval: gloVar.commentInterval });
        } else {
            sendResponse({
                error: "commentInterval is not defined in Content_script",
            });
        }
    }
});

//If changed the page of youutbe specifically
window.addEventListener("yt-navigate-start", function () {
    UIHandler1.hideControlsOnWebpage();
});
