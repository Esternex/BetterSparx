async function sendDarkMode(state) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    chrome.tabs.sendMessage(tab.id, {
        action: state ? "applyDarkMode" : "revokeDarkMode",
        settings: {
            darkMode: state,
            darkModeImages: true,
            whiteboardDarkModeOverride: false
        }
    });

    chrome.storage.local.set({ darkMode: state });
}

document.addEventListener("DOMContentLoaded", () => {

    const darkToggle = document.getElementById("DarkMode");
    const lightToggle = document.getElementById("LightMode");
    const discordButton = document.getElementById("DiscordButton");
    const copyCookiesButton = document.getElementById("CopyCookies");

    chrome.storage.local.get("darkMode", data => {
        if (data.darkMode) {
            darkToggle.checked = true;
        } else {
            lightToggle.checked = true;
        }
    });

    discordButton?.addEventListener("click", () => {
        window.open("https://discord.gg/churroai", "_blank");
    });

    darkToggle?.addEventListener("change", () => {
        if (darkToggle.checked) sendDarkMode(true);
    });

    lightToggle?.addEventListener("change", () => {
        if (lightToggle.checked) sendDarkMode(false);
    });

    copyCookiesButton?.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.runtime.sendMessage({ action: "getCookies", url: tabs[0].url }, response => {
                if (!response.success) {
                    alert("No cookies found for this site!");
                    return;
                }
                navigator.clipboard.writeText(response.cookies)
                    .then(() => alert("Cookies copied to clipboard!"))
                    .catch(err => console.error("Clipboard error:", err));
            });
        });
    });

});
