(() => {
    let platform = 'unknown';
    let postSelector = '';

    // Detect platform
    if (window.location.hostname.includes('instagram.com')) {
        platform = 'instagram';
        postSelector = 'article';           // Reliable for IG posts
    } else if (window.location.hostname.includes('facebook.com')) {
        platform = 'facebook';
        postSelector = 'div[role="article"], div[data-testid="feed_story"]';
    }

    if (platform === 'unknown') return;

    console.log(`🚫 ${platform.toUpperCase()} Content Filter loaded`);

    function createOverlay() {
        if (document.getElementById('work-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'work-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.92);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
            text-align: center;
        `;

        overlay.innerHTML = `
            <div>
                <h1 style="font-size: 3rem; margin-bottom: 1rem;">⏰ Get back to work!</h1>
                <p style="font-size: 1.4rem; opacity: 0.9;">You've seen enough posts for now.</p>
                <button id="dismiss-overlay" style="
                    margin-top: 2rem;
                    padding: 12px 32px;
                    font-size: 1.1rem;
                    background: #0095f6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">Continue for 5 more minutes</button>
            </div>
        `;

        document.body.appendChild(overlay);

        // Allow temporary override
        document.getElementById('dismiss-overlay').addEventListener('click', () => {
            overlay.remove();
            setTimeout(() => {
                if (!document.getElementById('work-overlay')) {
                    limitFeed(); // Re-apply filter after delay
                }
            }, 300000); // 5 minutes
        });
    }

    function limitFeed() {
        const posts = document.querySelectorAll(postSelector);

        let visibleCount = 0;

        posts.forEach((post) => {
            // Skip already hidden or very small elements
            if (post.style.display === 'none' || post.offsetHeight < 50) return;

            visibleCount++;

            if (visibleCount > 5) {
                post.style.setProperty("display", "none", "important");
            }
        });

        // Show overlay after 4-5 visible posts
        if (visibleCount >= 5 && !document.getElementById('work-overlay')) {
            // Small delay so user sees the 5th post briefly
            setTimeout(() => {
                if (document.querySelectorAll(postSelector + ':not([style*="display: none"])').length >= 4) {
                    createOverlay();
                }
            }, 800);
        }
    }

    // Initial run
    limitFeed();

    // Watch for new posts (infinite scroll)
    const observer = new MutationObserver(() => {
        requestAnimationFrame(limitFeed);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also run periodically in case of heavy dynamic updates
    setInterval(limitFeed, 2000);
})();