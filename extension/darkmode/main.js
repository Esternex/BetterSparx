const DarkMode = (() => {

    let _settings = {};

    const CSS_ID = "darkmodeSP";

    function setCSS(path) {
        const el = document.getElementById("darkmodeSP") 
            || Object.assign(document.createElement("link"), {
                id: "darkmodeSP",
                rel: "stylesheet"
            });

        document.head.appendChild(el);

        el.href = new URL(path, chrome.runtime.getURL("darkmode/")).toString();
    }

    function removeEffects() {
        document.querySelectorAll(".SparxPlusImageInverted")
            .forEach(el => el.classList.remove("SparxPlusImageInverted"));
    }

    return {

        init(settings) {
            _settings = settings || {};
        },

        applyDarkMode() {

            setCSS("darkmode/darkmaths.css");

          document.body.style.cssText += "background: #0a0a0a !important; background-image: none !important;";

            document.querySelectorAll("img, video").forEach(el => {
                if (_settings.darkModeImages) {
                    el.style.filter = "invert(1) hue-rotate(180deg)";
                }
            });

            document.querySelectorAll("canvas").forEach(c => {
                c.style.backgroundColor =
                    _settings.whiteboardDarkModeOverride ? "white" : "#2a2a28";
            });
        },

        revokeDarkMode() {

            setCSS("darkmode/defaultmaths.css");

            document.body.style.background = "";

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

// message bridge
chrome.runtime.onMessage.addListener((msg) => {

    if (msg.settings) {
        DarkMode.init(msg.settings);
    }

    if (msg.action === "applyDarkMode") {
        DarkMode.applyDarkMode();
    }

    if (msg.action === "revokeDarkMode") {
        DarkMode.revokeDarkMode();
    }
});
