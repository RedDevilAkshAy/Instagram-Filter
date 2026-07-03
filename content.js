(() => {
    if (!window.location.hostname.includes('facebook.com')) return;

    console.log("🔍 Facebook Broad Filter Loaded");

    function isMainFeed() {
        const url = window.location.href;
        return url === 'https://www.facebook.com/' || 
               url.endsWith('facebook.com') ||
               url.includes('/home') ||
               url.includes('sk=h_');
    }

    if (!isMainFeed()) {
        console.log("Not main feed");
        return;
    }

    console.log("🚀 Main Feed - Broad Filter Active");

    // Very broad selectors for current Facebook
    const broadSelectors = [
        'div[role="article"]',
        'div.x1yztbdb',           // Common container class
        'div[data-ad-preview="message"]',
        'div[style*="order:"]',   // Feed items often have order style
    ];

    function limitFeed() {
        let count = 0;
        let hidden = 0;

        broadSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`Selector "${selector}" → ${elements.length} elements`);

            elements.forEach(el => {
                // Skip very small elements
                if (el.offsetHeight < 200) return;

                count++;

                if (count > 5) {
                    const parent = el.parentElement || el;
                    parent.style.setProperty("display", "none", "important");
                    hidden++;
                    console.log(`Hidden element #${count}`);
                }
            });
        });

        console.log(`Total processed: ${count} | Hidden: ${hidden}`);

        if (count >= 5 && !document.getElementById('work-overlay')) {
            createOverlay();
        }
    }

    function createOverlay() {
        if (document.getElementById('work-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'work-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(255,255,255,0.97); z-index: 2147483647;
            display: flex; align-items: center; justify-content: center;
            font-family: system-ui;
        `;

        overlay.innerHTML = `
            <div style="text-align:center; padding: 40px;">
                <h1 style="font-size: 3.2rem; margin-bottom: 20px;">⏰ Get back to work!</h1>
                <p style="font-size: 1.5rem;">Enough scrolling for now.</p>
                <button id="dismiss" style="margin-top:30px; padding:16px 40px; font-size:1.2rem; background:#1877f2; color:white; border:none; border-radius:8px; cursor:pointer;">
                    5 more minutes
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.getElementById('dismiss').onclick = () => overlay.remove();
    }

    // Multiple runs
    [800, 2200, 4200].forEach(delay => setTimeout(limitFeed, delay));

    const observer = new MutationObserver(() => requestAnimationFrame(limitFeed));
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(limitFeed, 3500);
})();