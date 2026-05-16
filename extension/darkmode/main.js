const DarkMode = (() => {

    let settings = {};

    function loadCSS(file) {
        let link = document.getElementById("bsparx-dark");
        if (!link) {
            link = document.createElement("link");
            link.id = "bsparx-dark";
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }
        link.href = chrome.runtime.getURL("darkmode/" + file);
    }

    function removeEffects() {
        document.querySelectorAll(".SparxPlusImageInverted").forEach(el => {
            el.classList.remove("SparxPlusImageInverted");
        });
    }

    return {

        init(s) {
            settings = s || {};
        },

        applyDarkMode() {
            loadCSS("darkmaths.css");
            document.body.style.cssText += "background: #0a0a0a !important; background-image: none !important;";

            document.querySelectorAll("img, video").forEach(el => {
                if (settings.darkModeImages) {
                    el.style.filter = "invert(1) hue-rotate(180deg)";
                }
            });

            document.querySelectorAll("canvas").forEach(c => {
                c.style.backgroundColor = settings.whiteboardDarkModeOverride ? "white" : "#0a0a0a";
            });
        },

        revokeDarkMode() {
            loadCSS("defaultmaths.css");
            document.body.style.background = "";
            document.body.style.backgroundImage = "";

            document.querySelectorAll("img, video").forEach(el => {
                el.style.filter = "";
            });

            document.querySelectorAll("canvas").forEach(c => {
                c.style.backgroundColor = "white";
            });

            removeEffects();
        }
    };

})();

chrome.runtime.onMessage.addListener(msg => {
    if (msg.settings) DarkMode.init(msg.settings);
    if (msg.action === "applyDarkMode") DarkMode.applyDarkMode();
    if (msg.action === "revokeDarkMode") DarkMode.revokeDarkMode();
});
