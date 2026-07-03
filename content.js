(() => {
    const hostname = window.location.hostname;
    let platform = null;

    if (hostname.includes('instagram.com')) {
        platform = 'instagram';
    } else if (hostname.includes('facebook.com')) {
        platform = 'facebook';
    }

    if (!platform) return;

    function isMainFeed() {
        const url = window.location.href;
        if (platform === 'instagram') {
            return url === 'https://www.instagram.com/' || 
                   url === 'https://www.instagram.com' ||
                   (url.includes('instagram.com') && 
                    !url.includes('/p/') && !url.includes('/reel/') && 
                    !url.includes('/stories/'));
        }
        if (platform === 'facebook') {
            return url === 'https://www.facebook.com/' || 
                   url.endsWith('facebook.com') ||
                   url.includes('/home') || url.includes('sk=h_');
        }
        return false;
    }

    if (!isMainFeed()) {
        console.log(`✅ ${platform.toUpperCase()} - Not main feed`);
        return;
    }

    console.log(`🚀 ${platform.toUpperCase()} Main Feed Filter Active`);

    let postCount = 0;
    const MAX_POSTS = 5;

    function countPosts() {
        let currentCount = 0;

        if (platform === 'instagram') {
            currentCount = document.querySelectorAll('article').length;
        } else { // Facebook
            // Multiple ways to count posts
            const articles = document.querySelectorAll('div[role="article"]');
            const messages = document.querySelectorAll('div[data-ad-preview="message"]');
            currentCount = Math.max(articles.length, messages.length, 0);
        }

        if (currentCount > postCount) {
            postCount = currentCount;
            console.log(`📈 ${platform} Posts: ${postCount}`);

            if (postCount >= MAX_POSTS && !document.getElementById('work-overlay')) {
                console.log("🎯 Limit reached → Overlay");
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
            background: rgba(255,255,255,0.97);
            display: flex; align-items: center; justify-content: center;
            z-index: 2147483647; font-family: system-ui; color: #1c1e21;
        `;

        overlay.innerHTML = `
            <div style="text-align:center; padding: 40px;">
                <h1 style="font-size: 3.2rem; margin-bottom: 1rem;">⏰ Get back to work!</h1>
                <p style="font-size: 1.5rem;">You've seen enough posts for now.</p>
                <button id="dismiss-overlay" style="margin-top:30px; padding:16px 48px; font-size:1.2rem; background:#1877f2; color:white; border:none; border-radius:10px; cursor:pointer;">
                    Continue for 5 more minutes
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('dismiss-overlay').onclick = () => {
            overlay.remove();
            postCount = 3; // reset a little
        };
    }

    // Initial + observer
    setTimeout(countPosts, 1200);
    setTimeout(countPosts, 3000);

    const observer = new MutationObserver(() => requestAnimationFrame(countPosts));
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(countPosts, 2500);
})();