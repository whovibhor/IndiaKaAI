// Blog pagination functionality
import { blogPosts } from './blog-data.js';

document.addEventListener('DOMContentLoaded', function () {
    // Constants
    const POSTS_PER_PAGE = 4;
    const container = document.getElementById('blog-posts-container');
    const paginationNumbers = document.getElementById('pagination-numbers');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const blogContainer = document.querySelector('.blog-container');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-form input');

    // State variables
    let currentPage = 1;
    let filteredPosts = Object.values(blogPosts);
    let isFeaturedPostVisible = true;

    // Initialize
    init();

    function init() {
        // Get active filter if any
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            const filterCategory = activeFilter.textContent.trim();
            if (filterCategory !== 'All') {
                filteredPosts = Object.values(blogPosts).filter(post => post.category === filterCategory);
            }
        }

        // Add event listeners to filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', handleFilterClick);
        });

        // Add search functionality
        searchForm.addEventListener('submit', handleSearch);
        searchInput.addEventListener('input', handleSearch);

        // Add dismiss button to featured post
        setupFeaturedPost();

        // Set up pagination
        setupPagination();

        // Load initial posts
        loadPosts();

        // Add event listeners for pagination
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadPosts();
                updatePaginationUI();
                scrollToBlogContainer();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentPage < Math.ceil(filteredPosts.length / POSTS_PER_PAGE)) {
                currentPage++;
                loadPosts();
                updatePaginationUI();
                scrollToBlogContainer();
            }
        });
    }

    function scrollToBlogContainer() {
        blogContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function setupFeaturedPost() {
        const featuredPost = container.querySelector('.blog-card.featured');
        if (featuredPost && isFeaturedPostVisible) {
            // Create dismiss button container
            const dismissContainer = document.createElement('div');
            dismissContainer.className = 'dismiss-container';

            // Create dismiss button
            const dismissButton = document.createElement('button');
            dismissButton.className = 'dismiss-featured';
            dismissButton.innerHTML = '×';
            dismissButton.setAttribute('aria-label', 'Dismiss featured post');
            dismissButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFeaturedPostDismiss();
            });

            // Add button to container
            dismissContainer.appendChild(dismissButton);
            featuredPost.appendChild(dismissContainer);
        }
    }

    function handleFeaturedPostDismiss() {
        const featuredPost = container.querySelector('.blog-card.featured');
        if (!featuredPost) return;

        // Add animation class
        featuredPost.classList.add('dismissing');

        // After animation completes, remove the post and update layout
        featuredPost.addEventListener('animationend', () => {
            featuredPost.remove();
            isFeaturedPostVisible = false;
            loadPosts(); // Reload posts to adjust layout
        }, { once: true });
    }

    function handleFilterClick(e) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const category = e.target.textContent.trim();

        if (category === 'All') {
            filteredPosts = Object.values(blogPosts);
        } else {
            filteredPosts = Object.values(blogPosts).filter(post => post.category === category);
        }

        // Reset to first page when filter changes
        currentPage = 1;
        setupPagination();
        loadPosts();
    }

    function handleSearch(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm === '') {
            // If search is empty, show all posts
            filteredPosts = Object.values(blogPosts);
        } else {
            // Filter posts based on search term
            filteredPosts = Object.values(blogPosts).filter(post =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm) ||
                post.category.toLowerCase().includes(searchTerm)
            );
        }

        // Reset to first page when search changes
        currentPage = 1;
        setupPagination();
        loadPosts();
    }

    function setupPagination() {
        const pageCount = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
        paginationNumbers.innerHTML = '';

        for (let i = 1; i <= pageCount; i++) {
            const pageNumber = document.createElement('button');
            pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageNumber.textContent = i;
            pageNumber.setAttribute('aria-label', `Page ${i}`);

            pageNumber.addEventListener('click', () => {
                currentPage = i;
                loadPosts();
                updatePaginationUI();
                scrollToBlogContainer();
            });

            paginationNumbers.appendChild(pageNumber);
        }

        updatePaginationUI();
    }

    function updatePaginationUI() {
        const pageCount = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

        // Update page number buttons
        const pageButtons = paginationNumbers.querySelectorAll('.page-number');
        pageButtons.forEach((button, index) => {
            button.classList.toggle('active', index + 1 === currentPage);
        });

        // Update prev/next buttons
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === pageCount;
    }

    function loadPosts() {
        // Get posts for current page
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const currentPosts = filteredPosts.slice(startIndex, endIndex);

        // Create HTML for posts
        let postsHTML = '';

        // Regular posts
        currentPosts.forEach(post => {
            postsHTML += `
                <article class="blog-card">
                    <img src="${post.image}" alt="${post.title}">
                    <div class="blog-content">
                        <div class="blog-meta">
                            <span class="blog-tag">${post.category}</span>
                            <span class="blog-date">${post.date}</span>
                        </div>
                        <h3>${post.title}</h3>
                        <p>${post.content.substring(0, 150).replace(/<[^>]*>/g, '')}...</p>
                        <div class="blog-card-actions">
                            <a href="blog-post.html?id=${post.id}" class="btn btn-secondary">Read More</a>
                            <div class="blog-card-interaction">
                                <button class="btn-interact btn-like" aria-label="Like"><i class="far fa-heart"></i>
                                    <span class="count">${post.likes}</span></button>
                                <button class="btn-interact btn-comment" aria-label="Comment"><i class="far fa-comment"></i>
                                    <span class="count">${post.comments}</span></button>
                                <button class="btn-share" aria-label="Share"><i class="fas fa-share-alt"></i></button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        });

        // Remove any previously added regular posts
        const allCards = container.querySelectorAll('.blog-card:not(.featured)');
        allCards.forEach(card => {
            if (!card.classList.contains('featured')) {
                card.remove();
            }
        });

        // Add the new posts
        if (isFeaturedPostVisible) {
            const featuredPost = container.querySelector('.blog-card.featured');
            if (featuredPost) {
                featuredPost.insertAdjacentHTML('afterend', postsHTML);
            }
        } else {
            container.innerHTML = postsHTML;
        }
    }
}); 