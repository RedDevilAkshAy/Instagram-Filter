(() => {
    let platform = 'unknown';
    let postSelectors = [];

    // Platform detection
    if (window.location.hostname.includes('instagram.com')) {
        platform = 'instagram';
        postSelectors = ['article'];
    } else if (window.location.hostname.includes('facebook.com')) {
        platform = 'facebook';
        // Multiple fallback selectors for Facebook (very dynamic DOM)
        postSelectors = [
            'div[role="article"]',
            'div[data-testid="feed_story"]',
            '[data-pagelet*="FeedUnit"]',
            'div[aria-posinset]'
        ];
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
            background: rgba(255, 255, 255, 0.98);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #1c1e21;
            text-align: center;
        `;

        overlay.innerHTML = `
            <div>
                <h1 style="font-size: 3rem; margin-bottom: 1rem;">⏰ Get back to work!</h1>
                <p style="font-size: 1.4rem; opacity: 0.9; max-width: 500px;">
                    You've seen enough posts for now.
                </p>
                <button id="dismiss-overlay" style="
                    margin-top: 2rem;
                    padding: 14px 36px;
                    font-size: 1.1rem;
                    background: #1877f2;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">Continue for 5 more minutes</button>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('dismiss-overlay').addEventListener('click', () => {
            overlay.remove();
            setTimeout(() => limitFeed(), 300000); // 5 minutes
        });
    }

    function getAllPosts() {
        let allPosts = [];
        postSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!allPosts.includes(el)) allPosts.push(el);
            });
        });
        return allPosts;
    }

    function limitFeed() {
        const posts = getAllPosts();
        let visibleCount = 0;

        posts.forEach((post) => {
            // Skip already hidden or tiny elements
            if (post.style.display === 'none' || post.offsetHeight < 100) return;

            visibleCount++;

            if (visibleCount > 5) {
                post.style.setProperty("display", "none", "important");
            }
        });

        // Show overlay after ~5 posts
        if (visibleCount >= 5 && !document.getElementById('work-overlay')) {
            setTimeout(() => {
                const currentVisible = getAllPosts().filter(p => 
                    p.offsetHeight > 100 && 
                    p.style.display !== 'none'
                ).length;

                if (currentVisible >= 4) {
                    createOverlay();
                }
            }, 1200);
        }
    }

    // Initial run
    limitFeed();

    // MutationObserver for infinite scroll
    const observer = new MutationObserver(() => {
        requestAnimationFrame(limitFeed);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Extra safety net
    setInterval(limitFeed, 2500);

})();