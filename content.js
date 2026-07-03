(() => {
    const hostname = window.location.hostname;
    if (!hostname.includes('facebook.com')) return;

    console.log("🔍 Facebook Feed Filter v2 Loaded");

    function isMainFeed() {
        const url = window.location.href;
        return url === 'https://www.facebook.com/' || 
               url === 'https://www.facebook.com' ||
               url.includes('/home') ||
               url.includes('sk=h_chr') || 
               url.includes('sk=h_nor');
    }

    if (!isMainFeed()) {
        console.log("✅ Not on main feed → skipping");
        return;
    }

    console.log("🚀 Main Facebook Feed Detected");

    const postSelectors = ['div[role="article"]'];   // Best one for now

    function getAllPosts() {
        return Array.from(document.querySelectorAll(postSelectors[0]));
    }

    function limitFeed() {
        const posts = getAllPosts();
        let visibleCount = 0;

        posts.forEach(post => {
            // Skip if already hidden or very small
            if (post.style.display === 'none') return;

            // Better visibility check
            const height = post.offsetHeight;
            if (height < 150) return;   // Skip headers, ads, etc.

            visibleCount++;

            if (visibleCount > 5) {
                post.style.setProperty("display", "none", "important");
                console.log(`✅ Hidden post #${visibleCount}`);
            } else {
                console.log(`Post ${visibleCount} kept (height: ${height})`);
            }
        });

        console.log(`📊 Visible posts: ${visibleCount}`);

        if (visibleCount >= 5 && !document.getElementById('work-overlay')) {
            console.log("🛑 Showing Get back to work overlay");
            createOverlay();
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
            z-index: 2147483647; font-family: system-ui;
            color: #1c1e21;
        `;

        overlay.innerHTML = `
            <div style="text-align:center;">
                <h1 style="font-size: 3rem; margin-bottom: 1rem;">⏰ Get back to work!</h1>
                <p style="font-size: 1.4rem; max-width: 480px; margin: 0 auto 2rem;">
                    You've seen enough posts for now.
                </p>
                <button id="dismiss-overlay" style="
                    padding: 14px 40px; font-size: 1.1rem; 
                    background: #1877f2; color: white; border: none; 
                    border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Continue for 5 minutes
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('dismiss-overlay').onclick = () => {
            overlay.remove();
        };
    }

    // Initial runs with delay
    setTimeout(limitFeed, 1200);
    setTimeout(limitFeed, 3000);

    // Observer
    const observer = new MutationObserver(() => {
        requestAnimationFrame(limitFeed);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Periodic check
    setInterval(limitFeed, 3000);
})();