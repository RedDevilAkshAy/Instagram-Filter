(() => {
    const hostname = window.location.hostname;
    if (!hostname.includes('facebook.com')) return;

    console.log("🔍 Facebook Filter Debug Loaded");

    // ================== FEED DETECTION ==================
    function isMainFeed() {
        const url = window.location.href;
        return url === 'https://www.facebook.com/' || 
               url === 'https://www.facebook.com' ||
               url.includes('/home') ||
               url.includes('sk=h_chr') || 
               url.includes('sk=h_nor');
    }

    if (!isMainFeed()) {
        console.log("✅ On profile / post / other page → Filter skipped");
        return;
    }

    console.log("🚀 Main Facebook Feed Detected - Filter Active");

    const postSelectors = [
        'div[role="article"]',
        'div[data-testid="feed_story"]',
        '[data-pagelet*="FeedUnit"]',
        'div[aria-posinset]'
    ];

    function getAllPosts() {
        let posts = [];
        postSelectors.forEach(sel => {
            const found = document.querySelectorAll(sel);
            console.log(`Found ${found.length} with selector: ${sel}`);
            found.forEach(el => {
                if (!posts.includes(el)) posts.push(el);
            });
        });
        console.log(`Total unique posts found: ${posts.length}`);
        return posts;
    }

    function limitFeed() {
        const posts = getAllPosts();
        let visibleCount = 0;

        posts.forEach((post, index) => {
            if (post.offsetHeight < 100) return;

            visibleCount++;

            if (visibleCount > 5) {
                post.style.setProperty("display", "none", "important");
                console.log(`Hidden post #${visibleCount}`);
            }
        });

        console.log(`Visible posts: ${visibleCount}`);

        if (visibleCount >= 5) {
            console.log("⚠️ Showing 'Get back to work' overlay");
            createOverlay();
        }
    }

    function createOverlay() {
        if (document.getElementById('work-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'work-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(255, 255, 255, 0.98);
            display: flex; align-items: center; justify-content: center;
            z-index: 2147483647; font-family: system-ui;
            color: #1c1e21; text-align: center;
        `;

        overlay.innerHTML = `
            <div>
                <h1 style="font-size: 3rem; margin: 0 0 1rem 0;">⏰ Get back to work!</h1>
                <p style="font-size: 1.4rem; margin: 0 0 2rem 0;">You've seen enough posts.</p>
                <button id="dismiss-overlay" style="padding: 14px 36px; font-size: 1.1rem; background: #1877f2; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Continue for 5 minutes
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.getElementById('dismiss-overlay').onclick = () => overlay.remove();
    }

    // Run immediately
    setTimeout(limitFeed, 1500);

    // Observer
    const observer = new MutationObserver(() => requestAnimationFrame(limitFeed));
    observer.observe(document.body, { childList: true, subtree: true });

    // Extra logging
    setInterval(() => {
        console.log("🔄 Feed check running...");
        limitFeed();
    }, 4000);
})();