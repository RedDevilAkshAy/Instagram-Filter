(() => {
    if (!window.location.hostname.includes('facebook.com')) return;

    console.log("🔍 Facebook Aggressive Filter Loaded");

    function isMainFeed() {
        const url = window.location.href.toLowerCase();
        return url.endsWith('facebook.com/') || 
               url.includes('/home') ||
               url.includes('sk=h_');
    }

    if (!isMainFeed()) {
        console.log("Not on main feed");
        return;
    }

    console.log("🚀 Main Feed Detected - Aggressive Mode");

    function limitFeed() {
        // Try multiple strategies
        const articles = document.querySelectorAll('div[role="article"]');
        console.log(`Found ${articles.length} articles`);

        let count = 0;
        articles.forEach(article => {
            // Find a good parent to hide
            let target = article;

            // Go up a few levels to find a bigger container
            for (let i = 0; i < 4; i++) {
                if (target.parentElement) target = target.parentElement;
            }

            count++;
            if (count > 5) {
                target.style.setProperty("display", "none", "important");
                console.log(`Hidden container #${count}`);
            }
        });

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
            font-family: system-ui; color: #111;
        `;

        overlay.innerHTML = `
            <div style="text-align: center; max-width: 500px;">
                <h1 style="font-size: 42px; margin-bottom: 16px;">⏰ Get back to work!</h1>
                <p style="font-size: 22px; margin-bottom: 30px;">You've seen enough posts for now.</p>
                <button id="dismiss" style="padding: 16px 40px; font-size: 18px; background: #1877f2; color: white; border: none; border-radius: 10px; cursor: pointer;">
                    Continue for 5 minutes
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.getElementById('dismiss').onclick = () => overlay.remove();
    }

    // Run multiple times
    setTimeout(limitFeed, 1000);
    setTimeout(limitFeed, 2500);
    setTimeout(limitFeed, 4500);

    const observer = new MutationObserver(() => requestAnimationFrame(limitFeed));
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(limitFeed, 4000);
})();