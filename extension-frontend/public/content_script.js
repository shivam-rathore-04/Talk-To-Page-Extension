chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extract_text") {
        
        // Clone the body so we can modify it without breaking the user's view
        const clone = document.body.cloneNode(true);

        // Remove "Junk" tags that confuse the AI (Scripts, Styles, Ads, Navbars)
        const junkTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'NAV', 'HEADER', 'FOOTER', 'SVG'];
        junkTags.forEach(tagName => {
            const elements = clone.getElementsByTagName(tagName);
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        });

        // Get Clean Text
        let cleanText = clone.innerText || "";
        
        // Remove extra whitespace/newlines to save space
        cleanText = cleanText.replace(/\s+/g, " ").trim();
        
        // // Limit text length to prevent backend crashes (approx 15k words)
        // if (cleanText.length > 50000) {
        //     cleanText = cleanText.substring(0, 50000) + "... (truncated)";
        // }

        sendResponse({ text: cleanText });
    }
    return true;
});