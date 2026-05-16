async function sendDarkMode(state) {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (!tab?.id) return;

    chrome.tabs.sendMessage(tab.id, {
        action: state ? "applyDarkMode" : "revokeDarkMode",
        settings: {
            darkMode: state,
            darkModeImages: true,
            whiteboardDarkModeOverride: false
        }
    });
}

async function pullFullName() {
    const el = document.querySelector('span._StudentName_');
    const fullname = el.textContent;

    return fullname;
}

document.addEventListener("DOMContentLoaded", () => {

    const discordButton = document.getElementById("DiscordButton");
    const darkToggle = document.getElementById("DarkMode");

    if (discordButton) {
        discordButton.addEventListener("click", () => {
            window.open("https://discord.gg/churroai", "_blank");
        });
    }

    if (darkToggle) {
        darkToggle.addEventListener("change", () => {
            sendDarkMode(darkToggle.checked);
        });
    }
});