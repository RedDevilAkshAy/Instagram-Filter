(() => {
    const hostname = window.location.hostname;
    let platform = null;

    if (hostname.includes('instagram.com')) platform = 'instagram';
    else if (hostname.includes('facebook.com')) platform = 'facebook';

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
        console.log(`✅ ${platform.toUpperCase()} - Not on main feed`);
        return;
    }

    console.log(`🚀 ${platform.toUpperCase()} Feed Filter Active (max 5 posts)`);

    let postCount = 0;

    function countPosts() {
        let current = 0;

        if (platform === 'instagram') {
            current = document.querySelectorAll('article').length;
        } else { // Facebook
            current = Math.max(
                document.querySelectorAll('div[role="article"]').length,
                document.querySelectorAll('div[data-ad-preview="message"]').length
            );
        }

        if (current > postCount) {
            postCount = current;
            console.log(`📈 ${platform} Posts detected: ${postCount}`);

            if (postCount >= 5 && !document.getElementById('work-overlay')) {
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
            z-index: 2147483647; font-family: system-ui;
        `;

        overlay.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <h1 style="font-size:3.2rem; margin-bottom:1rem;">⏰ Get back to work!</h1>
                <p style="font-size:1.5rem;">You've seen enough posts for now.</p>
                <button id="dismiss" style="margin-top:30px;padding:16px 48px;font-size:1.2rem;background:#1877f2;color:white;border:none;border-radius:10px;cursor:pointer;">
                    Continue for 5 more minutes
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.getElementById('dismiss').onclick = () => overlay.remove();
    }

    // Start monitoring
    setTimeout(countPosts, 1000);
    setTimeout(countPosts, 2800);

    const observer = new MutationObserver(() => requestAnimationFrame(countPosts));
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(countPosts, 3000);
})();