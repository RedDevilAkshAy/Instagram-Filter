(() => {
    if (!window.location.hostname.includes('facebook.com')) return;

    console.log("🔍 Facebook Post Counter Filter Loaded");

    function isMainFeed() {
        const url = window.location.href;
        return url === 'https://www.facebook.com/' || 
               url.endsWith('facebook.com') ||
               url.includes('/home') || url.includes('sk=h_');
    }

    if (!isMainFeed()) {
        console.log("Not on main feed");
        return;
    }

    let postCounter = 0;
    const MAX_POSTS = 5;

    console.log(`🚀 Facebook Feed Counter Active (max ${MAX_POSTS} posts)`);

    function countAndLimit() {
        // Get all potential posts
        const articles = document.querySelectorAll('div[role="article"]');
        const messages = document.querySelectorAll('div[data-ad-preview="message"]');

        const totalDetected = Math.max(articles.length, messages.length);

        if (totalDetected > postCounter) {
            postCounter = totalDetected;
            console.log(`📈 Post counter updated: ${postCounter}`);

            if (postCounter >= MAX_POSTS && !document.getElementById('work-overlay')) {
                console.log("🎯 5+ posts reached → Showing overlay");
                createOverlay();
            }
        }
    }

    function createOverlay() {
        if (document.getElementById('work-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'work-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(255, 255, 255, 0.97);
            display: flex; align-items: center; justify-content: center;
            z-index: 2147483647; font-family: system-ui; color: #1c1e21;
        `;

        overlay.innerHTML = `
            <div style="text-align: center; max-width: 520px; padding: 40px;">
                <h1 style="font-size: 3.2rem; margin-bottom: 1rem;">⏰ Get back to work!</h1>
                <p style="font-size: 1.5rem;">You've reached your post limit for now.</p>
                <button id="dismiss-overlay" style="
                    margin-top: 2rem; padding: 16px 48px; font-size: 1.2rem;
                    background: #1877f2; color: white; border: none; 
                    border-radius: 10px; cursor: pointer; font-weight: 600;">
                    Continue for 5 more minutes
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('dismiss-overlay').addEventListener('click', () => {
            overlay.remove();
            postCounter = 3; // Reset a bit so it doesn't immediately trigger again
        });
    }

    // Run counter frequently
    setTimeout(countAndLimit, 1200);
    setTimeout(countAndLimit, 3000);

    const observer = new MutationObserver(() => {
        requestAnimationFrame(countAndLimit);
    });

    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });

    // Backup timer
    setInterval(countAndLimit, 2500);
})();