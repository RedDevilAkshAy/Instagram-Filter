(() => {
    function limitFeed() {
        const posts = document.querySelectorAll("article");

        posts.forEach((post, index) => {
            if (index >= 5) {
                post.style.setProperty("display", "none", "important");
            }
        });
    }

    limitFeed();

    const observer = new MutationObserver(() => {
        requestAnimationFrame(limitFeed);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log("Instagram limited to first 5 posts.");
})();