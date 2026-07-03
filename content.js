(() => {
    if (!window.location.hostname.includes('facebook.com')) return;

    console.log("🔍 Facebook Feed Container Filter Loaded");

    function isMainFeed() {
        const url = window.location.href;
        return url === 'https://www.facebook.com/' || 
               url.endsWith('/facebook.com') ||
               url.includes('/home') || url.includes('sk=h_');
    }

    if (!isMainFeed()) {
        console.log("Not on main feed");
        return;
    }

    console.log("🚀 Targeting main feed container");

    function limitFeed() {
        // Find the main feed
        const feed = document.querySelector('div[role="feed"]') || 
                     document.querySelector('[aria-label="News Feed"]') || 
                     document.querySelector('div[data-pagelet="Feed"]');

        if (!feed) {
            console.log("Feed container not found yet...");
            return;
        }

        console.log("✅ Feed container found!");

        const children = Array.from(feed.children);
        let postCount = 0;

        children.forEach(child => {
            if (child.offsetHeight < 150) return; // Skip small elements

            postCount++;

            if (postCount > 5) {
                child.style.setProperty("display", "none", "important");
                console.log(`Hidden child #${postCount}`);
            } else {
                console.log(`Kept child #${postCount}`);
            }
        });

        if (postCount >= 5 && !document.getElementById('work-overlay')) {
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
        `;

        overlay.innerHTML = `
            <div style="text-align:center">
                <h1 style="font-size: 3rem;">⏰ Get back to work!</h1>
                <p style="font-size: 1.5rem; margin: 20px 0;">You've seen enough.</p>
                <button id="dismiss" style="padding: 15px 40px; font-size: 1.2rem; background: #1877f2; color: white; border: none; border-radius: 8px;">
                    5 more minutes
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.getElementById('dismiss').onclick = () => overlay.remove();
    }

    // Run with delays
    setTimeout(limitFeed, 1500);
    setTimeout(limitFeed, 3500);
    setTimeout(limitFeed, 6000);

    const observer = new MutationObserver(() => requestAnimationFrame(limitFeed));
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(limitFeed, 4000);
})();