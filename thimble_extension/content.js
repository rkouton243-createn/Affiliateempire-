(function() {
    'use strict';

    let lastApplied = 0;
    const COOLDOWN = 500; // ms

    function applyTransparency() {
        const now = Date.now();
        if (now - lastApplied < COOLDOWN) return;
        lastApplied = now;

        // Target common 1xBet thimble classes identified from research and mockups
        const selectors = [
            '.thimbles-game__thimble', // Mockup/Common BEM
            '.thimbles-thimble',       // Possible variation
            '[class*="thimble"]'       // Fallback: any element with "thimble" in class
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.style.opacity !== '0.5') {
                    el.style.setProperty('opacity', '0.5', 'important');
                }
            });
        });
    }

    // Initial application
    applyTransparency();

    // Use MutationObserver to handle dynamic content with throttling
    const observer = new MutationObserver((mutations) => {
        // Check if any added nodes might be thimbles
        const hasNewNodes = mutations.some(m => m.addedNodes.length > 0);
        if (hasNewNodes) {
            applyTransparency();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('1xBet Thimbles Transparency Hack Loaded');
})();
