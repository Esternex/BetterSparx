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

async function removeNameFromPage(fullName) {
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

    function redactElement(el) {
        if (['SCRIPT', 'STYLE'].includes(el.tagName)) return;

        for (const node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && pattern.test(node.textContent)) {
                el.remove();
                break;
            }
        }
    }

    document.querySelectorAll('*').forEach(redactElement);

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    redactElement(node);
                    node.querySelectorAll('*').forEach(redactElement);
                }

                if (node.nodeType === Node.TEXT_NODE && pattern.test(node.textContent)) {
                    node.parentElement?.remove();
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,   
        subtree: true,     
        characterData: true 
    });

    return observer;
}

document.addEventListener("DOMContentLoaded", () => {
    const antiDoxxToggle = document.getElementById("antiDoxToggle");
    const discordButton = document.getElementById("DiscordButton");
    const darkToggle = document.getElementById("DarkMode");
    const copyCookiesButton = document.getElementById("CopyCookies");

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
        observer = NaN

        if (antiDoxxToggle.checked == true) { // already checked
            observer = removeNameFromPage(name)
        }

        antiDoxxToggle.addEventListener("change", () => {
            if (antiDoxxToggle.checked == true) {
                observer = removeNameFromPage(name)
            } else {
                observer.disconnect();
                observer = NaN
            }
        }); 
    }

    if (copyCookiesButton) {
        copyCookiesButton.addEventListener("click", () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const tabUrl = tabs[0].url;

                chrome.runtime.sendMessage(
                    { action: "getCookies", url: tabUrl },
                    (response) => {
                    if (!response.success) {
                        alert("No cookies found for this site!");
                        return;
                    }

                    // Copy cookies to clipboard
                    navigator.clipboard.writeText(response.cookies)
                        .then(() => alert("Cookies copied to clipboard!"))
                        .catch(err => console.error("Clipboard error: ", err));
                    }
                );
            });
        });
    }
});