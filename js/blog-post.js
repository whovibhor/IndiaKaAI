import { blogPosts } from './blog-data.js';

document.addEventListener('DOMContentLoaded', function () {
    // Get the blog post ID from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('id');

    if (!postId) {
        displayError("Blog post not found. Please try another post.");
        return;
    }

    // Load blog post data
    loadBlogPost(postId);

    // Load related posts
    loadRelatedPosts(postId);

    // Load more articles
    loadMoreArticles(postId);

    // Set up share links
    setupShareLinks();
});

function loadBlogPost(postId) {
    const post = blogPosts[postId];

    if (!post) {
        displayError("Blog post not found. Please try another post.");
        return;
    }

    // Set post metadata
    document.getElementById('post-category').textContent = post.category;
    document.getElementById('post-date').textContent = post.date;
    document.getElementById('post-author').textContent = post.author;
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-image').src = post.image;
    document.getElementById('post-image').alt = post.title;

    // Set post content
    document.getElementById('post-content').innerHTML = post.content;

    // Set author information
    document.getElementById('author-name').textContent = post.author;
    document.getElementById('author-bio').textContent = post.authorBio;

    // Set page title
    document.title = `${post.title} - India ka AI`;
}

function loadRelatedPosts(currentPostId) {
    const post = blogPosts[currentPostId];
    if (!post || !post.related) return;

    const relatedPostsContainer = document.getElementById('related-posts');
    relatedPostsContainer.innerHTML = '';

    post.related.forEach(relatedPostId => {
        const relatedPost = blogPosts[relatedPostId];
        if (!relatedPost) return;

        const relatedPostHTML = `
            <a href="blog-post.html?id=${relatedPostId}" class="popular-post">
                <img src="${relatedPost.image}" alt="${relatedPost.title}">
                <div class="popular-post-content">
                    <h4>${relatedPost.title}</h4>
                    <span class="post-date">${relatedPost.date}</span>
                </div>
            </a>
        `;

        relatedPostsContainer.innerHTML += relatedPostHTML;
    });
}

function loadMoreArticles(currentPostId) {
    const articlesGrid = document.querySelector('.articles-grid');
    articlesGrid.innerHTML = '';

    // Get 3 random posts excluding the current one
    const otherPostIds = Object.keys(blogPosts).filter(id => id !== currentPostId);
    const randomPosts = otherPostIds.sort(() => 0.5 - Math.random()).slice(0, 3);

    randomPosts.forEach(postId => {
        const post = blogPosts[postId];

        const articleHTML = `
            <article class="blog-card">
                <img src="${post.image}" alt="${post.title}">
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-tag">${post.category}</span>
                        <span class="blog-date">${post.date}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.content.substring(0, 150).replace(/<[^>]*>/g, '')}...</p>
                    <a href="blog-post.html?id=${postId}" class="btn btn-secondary">Read More</a>
                </div>
            </article>
        `;

        articlesGrid.innerHTML += articleHTML;
    });
}

function setupShareLinks() {
    const shareLinks = document.querySelectorAll('.share-link');
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    shareLinks.forEach(link => {
        const icon = link.querySelector('i');

        if (icon.classList.contains('fa-twitter')) {
            link.href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
        } else if (icon.classList.contains('fa-linkedin')) {
            link.href = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`;
        } else if (icon.classList.contains('fa-facebook')) {
            link.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        } else if (icon.classList.contains('fa-whatsapp')) {
            link.href = `https://api.whatsapp.com/send?text=${pageTitle} ${pageUrl}`;
        }

        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });
}

function displayError(message) {
    const container = document.querySelector('.blog-post-container');
    container.innerHTML = `
        <div class="error-message">
            <h2>Oops! Something went wrong</h2>
            <p>${message}</p>
            <a href="blog.html" class="btn btn-primary">Back to Blog</a>
        </div>
    `;
} 