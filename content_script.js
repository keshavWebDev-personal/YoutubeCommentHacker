//-------------------------------------------
//-------------------MAIN--------------------
//-------------------------------------------

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "Show Controls on webPage") {
        showControlsOnWebpage()
    }
});

let hideBtn = null

window.addEventListener('yt-navigate-start', function () {
    hideControlsOnWebpage()
});


//Some Functions
let intervalId = null
let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
let styleElem = null

function showControlsOnWebpage() {
    if (!document.getElementById('controlsDiv_commentHackerScript')) {

        insertCssInWebPage()
        let controlsDiv = createControlsDiv()
        addButton(controlsDiv)
        addCmntsCount(controlsDiv)

        //to add the controls div to the main webpage
        let commentsSection_titleElem = document.querySelector('ytd-comments#comments #title');
        commentsSection_titleElem.appendChild(controlsDiv)

        // If start button pressed
        button.addEventListener('mousedown', (e) => {
            toggleButtonState(button)
            toggleStartCommenting()
        })
    }
}
function hideControlsOnWebpage() {
    let controlsDiv = document.getElementById('controlsDiv_commentHackerScript')
    if (controlsDiv) {
        controlsDiv.remove()
        insertCssInWebPage('remove')
    }
}

function toggleStartCommenting() {

    function startStopRandomInterval(minTime, maxTime) {
        if (intervalId) {
            clearInterval(intervalId);
            clearTimeout(intervalId); // clear the setTimeout as well
            intervalId = null;
            console.log('Interval stopped');
        } else {
            console.log('Interval started');
            runRandomInterval(minTime, maxTime);
        }
    }

    function runRandomInterval(minTime, maxTime) {
        let intervalTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime; // random interval time between minTime and maxTime

        intervalId = setTimeout(() => {
            doComment();
            runRandomInterval(minTime, maxTime);
        }, intervalTime);
    }

    // Call sendMessage function to get minTime and maxTime values
    sendMessage().then(({ minTime, maxTime }) => {
        startStopRandomInterval(minTime, maxTime);
    }).catch((error) => {
        console.error(error);
    });
}

function sendMessage() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "get minTime maxTime" }, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                let minTime = response.minTime;
                let maxTime = response.maxTime;
                resolve({ minTime, maxTime });
            }
        });
    });
}


let commentInterval = 0
let commentsTextStack = [
    "This video is so inspiring and encouraging, it's exactly what we need to hear!",
    "I'm in awe of the message and values in this video, it's so positive and uplifting!",
    "This video is a true inspiration, it motivates me to be my best self and make a difference!",
    "I love how this video is using storytelling to inspire social change and encourage good values!",
    "This video has the power to change lives, it's that impactful!",
    "I'm so grateful for this video, it's spreading such an important message!",
    "The story and visuals in this video are so beautiful and heartfelt, it's touching!",
    "This video is a true masterpiece, it deserves all the recognition and support!",
    "I'm amazed by the creativity and innovation that went into creating this video, it's a true work of art!",
    "This video is a true representation of hope and positivity, it's so inspiring!",
    "I love how this video is using storytelling to address important issues and create change!",
    "This video is a game-changer, it's breaking barriers and paving the way for a better future!",
    "I'm blown away by the production and editing in this video, it's simply amazing!",
    "This video is so empowering and motivating, it's impossible not to feel inspired!",
    "I appreciate the effort and dedication that went into creating this video, thank you!",
    "This video is so relatable and honest, it's a true representation of life and struggles!",
    "I love how this video is promoting positive values and encouraging good behavior!",
    "This video is so powerful and moving, it's impossible not to be touched by it!",
    "I'm in love with the energy and passion in this video, it's contagious!",
    "This video is a true testament to the power of storytelling, it's amazing how it can influence us!",
    "I'm impressed by the talent and innovation in this video, it's so refreshing!",
    "This video is a true masterpiece, it's spreading a positive message that we all need to hear!",
    "I can't get enough of this video, it's a true anthem for change!",
    "This video is a true inspiration for the audience, it encourages them to make a difference and be the change!",
    "I love how this video is raising awareness about important issues and promoting social justice!",
    "This video is so uplifting and positive, it's exactly what we need in these challenging times!",
    "I'm in awe of the creativity and dedication that went into creating this video, it's a true masterpiece!",
    "This video is a true representation of the power of unity and collaboration, it's amazing!",
    "I'm blown away by the storytelling and visuals in this video, it's so beautiful and meaningful!",
    "This video is a true inspiration for anyone who wants to make a positive impact in the world!",
    "I love how this video is using storytelling to promote social change and encourage good values!",
    "This video is a true testament to the power of storytelling, it can bring people together and inspire them to act!",
    "I'm impressed by the talent and passion in this video, it's a true masterpiece!",
    "This video is so uplifting and positive, it's a true ray of sunshine in a world that can be dark at times!",
    "I'm in love with the story and visuals in this video, it's so inspiring and engaging!",
    "This video is a true gem, it's spreading so much positivity and hope!",
    "I'm blown away by the message and values in this video, it's exactly what we need in these times!",
    "This video is a true inspiration, it motivates me to be a better person and do good in the world!",
    "I love how this video is using storytelling to address important issues and encourage social change!",
    "This video is a true masterpiece, it deserves all the recognition and support!",
    "I'm so grateful for this video, it's spreading such an important message of hope and kindness!",
    "The visuals and music in this video are so powerful and moving, it's impossible not to be touched by it!",
    "This video is a true representation of the power of positivity, it's so inspiring!",
    "I'm in awe of the creativity and talent that went into creating this video, it's a true work of art!",
    "This video is so motivating and empowering, it's exactly what we need to hear right now!",
    "I love how this video is promoting important values and encouraging us to be our best selves!",
    "This video is a true game-changer, it's breaking down barriers and promoting social justice!",
    "I'm amazed by the storytelling and visuals in this video, it's simply amazing!",
    "This video is so uplifting and inspiring, it's impossible not to feel hopeful!",
    "I appreciate the effort and dedication that went into creating this video, it's making a real difference!",
    "This video is a true representation of the power of community and working together for a better future!",
    "I love how this video is using storytelling to inspire positive change and make a difference in the world!",
    "This video is so powerful and impactful, it's a true wake-up call for all of us!",
    "I'm in love with the energy and passion in this video, it's contagious!",
    "This video is a true testament to the power of creativity and innovation, it's so refreshing!",
    "I can't get enough of this video, it's a true anthem for hope and kindness!",
    "This video is a true inspiration for anyone who wants to make a positive impact in the world!",
    "I love how this video is using storytelling to promote social change and encourage good values!",
    "This video is a true testament to the power of storytelling, it can bring people together and inspire them to act!",
    "I'm impressed by the talent and passion in this video, it's a true masterpiece!",
    "This video is so uplifting and positive, it's a true ray of sunshine in a world that can be dark at times!",
    "I'm in love with the story and visuals in this video, it's so inspiring and engaging!",
    "This video is a true inspiration for anyone who wants to make a positive impact in their community!",
    "I love how this video is promoting important issues and encouraging us to make a difference in the world!",
    "This video is so motivating and inspiring, it's a true call to action!",
    "I'm blown away by the storytelling and visuals in this video, it's so powerful and meaningful!",
    "This video is a true testament to the power of unity and collaboration, it's amazing!",
    "I'm so grateful for this video, it's making a real difference in the world!",
    "This video is a true representation of the power of hope and positivity, it's so inspiring!",
    "Inspiring video!",
    "Thank you for the motivation!",
    "I'm ready to make a difference!",
    "Your message is powerful!",
    "I'm inspired to get involved!",
    "Thank you for the encouragement!",
    "Let's make a change!",
    "This is exactly what I needed!",
    "I'm ready to start volunteering!",
    "Your passion is contagious!",
    "Let's do this together!",
    "Thank you for the reminder!",
    "I'm excited to make a difference!",
    "Your words are impactful!",
    "Let's create positive change!",
    "I'm ready to take action!",
    "Thank you for the inspiration!",
    "Let's make the world a better place!",
    "I'm inspired to do social work!",
    "Your message is uplifting!",
    "Let's make a difference in our communities!",
    "I'm motivated to make a change!",
    "Thank you for the encouragement!",
    "Let's work together to create positive change!",
    "I'm ready to help others!",
    "Your words are powerful and inspiring!",
    "Let's spread kindness and love!",
    "I'm ready to get involved and make a difference!",
    "Thank you for the reminder to do good!",
    "Let's make the world a brighter place!",
    "I'm inspired to do more!",
    "Your passion is contagious and motivating!",
    "Let's be the change we wish to see in the world!",
    "I'm ready to create positive impact!",
    "Thank you for the uplifting message!",
    "Let's make a difference, one step at a time!",
    "I'm excited to do social work!",
    "Your words have touched my heart!",
    "Let's work together to create a better world!",
    "I'm ready to spread kindness and positivity!",
    "Thank you for the encouragement to do good!",
    "Let's inspire others to make a change!",
    "I'm ready to be a force for good!",
    "Your message is exactly what the world needs!",
    "Let's make a positive impact on those around us!",
    "I'm inspired to be the change I wish to see!",
    "Thank you for the motivation to do good!",
    "Let's make a difference in someone's life today!",
    "I'm ready to give back to my community!",
    "Your words have inspired me to take action!",
    "Let's spread love and compassion everywhere we go!",
    "I'm ready to make a positive change in the world!",
    "Thank you for the reminder to be kind!",
    "Let's inspire others to do social work!",
    "I'm motivated to create a better world!",
    "Your message is so powerful and inspiring!",
    "Let's make the world a better place, one person at a time!",
    "I'm ready to make a positive impact!",
    "Thank you for the encouragement to do good!",
    "Let's create positive change together!",
    "I'm inspired to make a difference in my community!",
    "Your passion for social work is contagious!",
    "Let's be the change we wish to see in the world!",
    "I'm ready to spread positivity and kindness!",
    "Thank you for the inspiration to make a difference!",
    "Let's work together to create a better tomorrow!",
    "I'm excited to do social work and help others!",
    "Your words have ignited a fire in my soul!",
    "Let's make the world a brighter and better place!",
    
]

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
    "\u{270C}",  // Victory Hand
    "\u{1F4AA}" // Flexed Biceps
]
function doComment() {
    document.getElementById('placeholder-area').click()

    let emojiString = ""


    for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
        emojiString = emojiString + emojiStack[Math.floor(Math.random() * emojiStack.length)]
    }

    let finalText = commentsTextStack[Math.floor(Math.random() * commentsTextStack.length)] + " " + emojiString

    document.getElementById('contenteditable-root').textContent = finalText
    document.getElementById('submit-button').click()
    commentInterval++
    document.querySelector('#cmntsCountDiv_commentHackerScript span').textContent = commentInterval;

}

function toggleButtonState(button) {
    button.classList.add("animate")
    let btnTextContent = button.textContent

    if (btnTextContent == 'Start') {
        button.textContent = 'Stop'
    } else {
        button.textContent = 'Start'
    }

    setTimeout(() => {
        button.classList.remove("animate")
    }, 600);

    setTimeout(() => {
        if (btnTextContent == 'Start') {
            button.parentNode.style.setProperty('--bubbles_color', '#f0203c')
        } else {
            button.parentNode.style.setProperty('--bubbles_color', '#20f020')
        }

    }, 300);
}

function insertCssInWebPage(State) {
    if (State) {
        styleElem.remove()
        return
    }
    styleElem = document.createElement('style')
    styleElem.setAttribute('type', 'text/css')

    styleElem.textContent = `
        #button_commentHackerScript:active {
            transform: scale(0.96);
            box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 5px;
        }
        
        #button_commentHackerScript::before,
        #button_commentHackerScript::after {

            content: "";
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            height: 100%;
            width: 150px;
            background-repeat: no-repeat;
        }
        #button_commentHackerScript.animate::before {
            top: -70%;
            background-image: radial-gradient(circle, var(--bubbles_color) 20%, transparent 20%),
                radial-gradient(circle, transparent 20%, var(--bubbles_color) 20%, transparent 30%),
                radial-gradient(circle, var(--bubbles_color) 20%, transparent 20%),
                radial-gradient(circle, transparent 10%, var(--bubbles_color) 15%, transparent 20%),
                radial-gradient(circle, var(--bubbles_color) 20%, transparent 20%),
                radial-gradient(circle, var(--bubbles_color) 20%, transparent 20%),
                radial-gradient(circle, var(--bubbles_color) 20%, transparent 20%);

            background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 18% 18%;
            background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
            animation: topBubbles 0.6s ease-in-out infinite;
        }
        @keyframes topBubbles {
            50% {
                background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;
            }

            100% {
                background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;

                background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;

            }
        }
        #button_commentHackerScript.animate::after {
            bottom: -70%;

            background-image: radial-gradient(circle, var(--bubbles_color) 20%, transparent 20%),
                radial-gradient(circle, transparent 10%, var(--bubbles_color) 15%, transparent 20%),
                radial-gradient(circle, var(--bubbles_color) 20%, transparent 20%),
                radial-gradient(circle, var(--bubbles_color) 20%, transparent 20%),
                radial-gradient(circle, var(--bubbles_color) 20%, transparent 20%),
                radial-gradient(circle, var(--bubbles_color) 20%, transparent 20%),
                radial-gradient(circle, var(--bubbles_color) 20%, transparent 20%);

            background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 20% 20%, 18% 18%;

            background-position: 10% 0%, 30% 10%, 55% 0%, 70% 0%, 85% 0%, 70% 0%, 70% 0%;

            animation: bottomBubbles 0.6s ease-in-out infinite;
        }
        @keyframes bottomBubbles {
            50% {
                background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
            }

            100% {
                background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%,
                    110% 10%;

                background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;

            }
        }

    `
    document.head.appendChild(styleElem)
}

function createControlsDiv() {
    let controlsDiv = document.createElement('div');
    controlsDiv.setAttribute('id', 'controlsDiv_commentHackerScript')
    controlsDiv.style.cssText = `
        --bubbles_color: #20f020;
        display: flex;
        justify-content: space-between;
        margin-left: 50px;
        font-family: "YouTube Sans","Roboto",sans-serif;
        font-weight: 600;
        box-sizing: border-box;
        min-width: 350px;
    `
    if (isDarkMode == false) {
        controlsDiv.style.backgroundColor = '#0000000d'
        controlsDiv.style.padding = '22px 25px'
        controlsDiv.style.borderRadius = '12px'
    }
    return controlsDiv
}

function addButton(controlsDiv) {
    button = document.createElement('button');
    button.style.cssText = `
        position: relative;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.5s ease;

        border: none;
        outline: none;
        padding: 7px 20px;
        border-radius: 5px;

        /* text Related */
        font-size: 20px;
        font-family: "YouTube Sans","Roboto",sans-serif;
        font-weight: 600;
    `;

    button.setAttribute('id', 'button_commentHackerScript')

    button.textContent = "Start"
    button.style.backgroundColor = "var(--bubbles_color)"

    if (isDarkMode == true) {
        button.style.color = 'white'
        button.style.boxShadow = '-5px -5px 8px rgb(255 255 255 / 11%), -16px -17px 13px rgb(255 256 255 / 2%), 5px 5px 13px rgb(0 0 0 / 101%)'
    } else {
        button.style.color = 'black'
        button.style.boxShadow = 'rgba(255, 255, 255, 0.9) -4px -4px 7px 1px, rgba(0, 0, 0, 0.3) 4px 4px 13px'

    }

    controlsDiv.appendChild(button)
}

function addCmntsCount(controlsDiv) {

    let cmntsCountContainer = document.createElement('div');
    let cmntsCountDiv = document.createElement('div');
    let cmntsCount_title = document.createElement('p');
    let cmtsCount_display = document.createElement('span')

    //CSS
    cmntsCountContainer.style.cssText = `
        --border_size: 0.7rem;
        position: relative;
        min-width: 170px;
    `
    cmntsCountDiv.style.cssText = `
        font-size: 25px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        text-align: center;
        min-width: 135px;
        padding: 5px 20px;
        border-radius: 5px;
        position: relative;
        z-index: 1;
    `
    cmtsCount_display.textContent = "0"
    cmtsCount_display.style.cssText = `
    margin-left: 10px;
    background: linear-gradient(45deg, #ff3b3b, #54a4ff);
    padding: 2px 12px;
    border-radius: var(--border_size);
    `


    //Atrributes Setting
    cmntsCountContainer.setAttribute('id', 'cmntsCountContainer_commentHackerScript')
    cmntsCountDiv.setAttribute('id', 'cmntsCountDiv_commentHackerScript')
    cmntsCount_title.innerHTML = "Done"


    if (isDarkMode == true) {
        cmntsCount_title.style.color = 'white'
        cmtsCount_display.style.color = 'black'
        cmntsCountDiv.style.backgroundColor = "#0F0F0F"
        cmntsCountDiv.style.boxShadow = '-5px -5px 8px rgb(255 255 255 / 11%), -16px -17px 13px rgb(255 256 255 / 2%), 5px 5px 13px rgb(0 0 0 / 101%)'

        styleElem.appendChild(document.createTextNode(`
            #cmntsCountContainer_commentHackerScript::after,
            #cmntsCountContainer_commentHackerScript::before{
                content: "";
                position: absolute;
                width: calc(var(--border_size) + 3px);
                height: calc(var(--border_size) + 3px);
                filter: blur(3px);
                
            }
            #cmntsCountContainer_commentHackerScript::after{
                bottom: 0;
                left: 0;
                transform: translate(-45%, 45%);
                background-image: conic-gradient(from 215deg , rgb(255 255 255 / 18%), black 75%);
            }
            #cmntsCountContainer_commentHackerScript::before{
                top: 0;
                right: 0;
                transform: translate(45%, -45%);
                background-image: conic-gradient(from 45deg , black, rgb(255 255 255 / 16%)96%);
            }
        `))

    } else {
        cmntsCountDiv.style.backgroundColor = "hsl(0deg 0% 95.3%)"
        cmntsCount_title.style.color = 'black'
        cmtsCount_display.style.color = 'white'
        cmntsCountDiv.style.boxShadow = 'rgba(255, 255, 255, 0.9) -4px -4px 7px 1px, rgba(0, 0, 0, 0.3) 4px 4px 13px'

        styleElem.appendChild(document.createTextNode(`
            #cmntsCountContainer_commentHackerScript::after,
            #cmntsCountContainer_commentHackerScript::before{
                content: "";
                position: absolute;
                width: calc(var(--border_size) + 3px);
                height: calc(var(--border_size) + 3px);
                filter: blur(3px);
                
            }
            #cmntsCountContainer_commentHackerScript::after{
                bottom: 0;
                left: 0;
                transform: translate(-45%, 45%);
                background-image: conic-gradient(from 215deg , rgb(255 255 255 / 18%), rgba(0,0,0,0.2)75%);
            }
            #cmntsCountContainer_commentHackerScript::before{
                top: 0;
                right: 0;
                transform: translate(45%, -45%);
                background-image: conic-gradient(from 45deg , rgba(0,0,0,0.3), rgb(255 255 255 / 16%)30.4%);
            }
        `))

    }

    //Appending
    cmntsCountDiv.appendChild(cmntsCount_title)
    cmntsCountDiv.appendChild(cmtsCount_display)
    cmntsCountContainer.appendChild(cmntsCountDiv)
    controlsDiv.appendChild(cmntsCountContainer)
}
