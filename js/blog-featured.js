import { blogPosts } from './blog-data.js';

function getRandomBlogPosts(count = 2) {
    // Convert blog posts object to array
    const postsArray = Object.values(blogPosts);

    // Shuffle the array
    const shuffled = postsArray.sort(() => 0.5 - Math.random());

    // Get the first 'count' posts
    return shuffled.slice(0, count);
}

function truncateText(text, maxWords = 20) {
    // Remove HTML tags and get plain text
    const plainText = text.replace(/<[^>]*>/g, '');
    const words = plainText.split(' ');

    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return plainText;
}

function updateBlogSection() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    // Get random blog posts
    const randomPosts = getRandomBlogPosts(2);

    // Clear existing content
    blogGrid.innerHTML = '';

    // Add new blog posts
    randomPosts.forEach((post, index) => {
        const article = document.createElement('article');
        article.className = 'blog-card';

        // Set featured tag for first post
        const featuredTag = index === 0 ?
            '<span class="blog-tag">Featured</span>' : '';

        // Get truncated content
        const truncatedContent = truncateText(post.content);

        article.innerHTML = `
            <img src="${post.image}" alt="${post.title}">
            <div class="blog-content">
                <div class="blog-meta">
                    ${featuredTag}
                    <span class="blog-date">${post.date}</span>
                    <span class="blog-author">By ${post.author}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${truncatedContent}</p>
                <div class="blog-actions">
                    <div class="blog-stats">
                        <button class="like-btn" data-post-id="${post.id}">
                            <i class="far fa-heart"></i>
                            <span>${post.likes}</span>
                        </button>
                        <button class="comment-btn" data-post-id="${post.id}">
                            <i class="far fa-comment"></i>
                            <span>${post.comments}</span>
                        </button>
                        <button class="share-btn" data-post-id="${post.id}">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                    <a href="blog-post.html?id=${post.id}" class="btn btn-primary">Read More</a>
                </div>
            </div>
        `;

        blogGrid.appendChild(article);
    });
}

// Update blog section when the page loads
document.addEventListener('DOMContentLoaded', updateBlogSection);

// Update blog section every 5 minutes
setInterval(updateBlogSection, 5 * 60 * 1000); 