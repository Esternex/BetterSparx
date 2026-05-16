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

function removeNameFromPage(fullName) {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const firstInitial = firstName[0];

    const variations = [
        fullName,
        `${lastName}, ${firstName}`,
        `${firstInitial}. ${lastName}`,
        `${firstName} ${lastName[0]}.`,
        firstName,
        lastName,
    ];

    const pattern = new RegExp(
        variations.map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
        'gi'
    );

    document.querySelectorAll('*').forEach(el => {
        if (['SCRIPT', 'STYLE'].includes(el.tagName)) return;

        for (const node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && pattern.test(node.textContent)) {
                el.remove();                
                break;
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const antiDoxxToggle = document.getElementById("antiDoxToggle");
    const discordButton = document.getElementById("DiscordButton");
    const darkToggle = document.getElementById("DarkMode");

    name = pullFullName()

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

    if (antiDoxxToggle) {
        if (antiDoxxToggle.checked == true) { // already checked
            name = pullFullName()
        }

        antiDoxxToggle.addEventListener("change", () => {

        }); 
    }
});