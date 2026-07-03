(() => {
    const hostname = window.location.hostname;
    let platform = null;
    let postSelector = '';

    if (hostname.includes('instagram.com')) {
        platform = 'instagram';
        postSelector = 'article';
    } else if (hostname.includes('facebook.com')) {
        platform = 'facebook';
        postSelector = 'div[role="article"]';
    }

    if (!platform) return;

    // ================== FEED DETECTION ==================
    function isMainFeed() {
        const url = window.location.href;

        if (platform === 'instagram') {
            return url === 'https://www.instagram.com/' || 
                   url === 'https://www.instagram.com' ||
                   (url.includes('instagram.com') && !url.includes('/p/') && 
                    !url.includes('/reel/') && !url.includes('/stories/'));
        }

        if (platform === 'facebook') {
            return url === 'https://www.facebook.com/' || 
                   url.endsWith('facebook.com') ||
                   url.includes('/home') || url.includes('sk=h_');
        }
        return false;
    }

    if (!isMainFeed()) {
        console.log(`✅ ${platform.toUpperCase()} - Not on main feed, skipping filter`);
        return;
    }

    console.log(`🚀 ${platform.toUpperCase()} Feed Filter Active`);

    let postCount = 0;
    const MAX_POSTS = 5;

    function countPosts() {
        const posts = document.querySelectorAll(postSelector);
        const currentCount = posts.length;

        if (currentCount > postCount) {
            postCount = currentCount;
            console.log(`📈 ${platform} Posts detected: ${postCount}`);

            if (postCount >= MAX_POSTS && !document.getElementById('work-overlay')) {
                console.log("🎯 Limit reached → Showing overlay");
                showOverlay();
            }
        }
    }

    function showOverlay() {
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
            <div style="text-align:center; max-width: 520px; padding: 40px;">
                <h1 style="font-size: 3.2rem; margin-bottom: 1rem;">⏰ Get back to work!</h1>
                <p style="font-size: 1.5rem;">You've seen enough posts for now.</p>
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
            postCount = 3; // soft reset
        });
    }

    // Initial checks
    setTimeout(countPosts, 1000);
    setTimeout(countPosts, 2500);

    // Mutation Observer
    const observer = new MutationObserver(() => {
        requestAnimationFrame(countPosts);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Backup
    setInterval(countPosts, 3000);
})();