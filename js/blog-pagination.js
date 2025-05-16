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
        // Adjust total posts count for pagination
        const adjustedTotalPosts = filteredPosts.length - 1; // Subtract 1 for featured post
        const pageCount = Math.ceil(adjustedTotalPosts / POSTS_PER_PAGE);

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
        let startIndex, endIndex;

        if (currentPage === 1) {
            // For first page: featured post + 4 regular posts
            startIndex = 0;
            endIndex = 5; // 1 featured + 4 regular
        } else {
            // For other pages: exactly 4 posts
            startIndex = (currentPage - 1) * POSTS_PER_PAGE;
            endIndex = startIndex + POSTS_PER_PAGE;
        }

        const currentPosts = filteredPosts.slice(startIndex, endIndex);

        // Clear the container first
        container.innerHTML = '';

        // Only show featured post on first page
        if (currentPage === 1 && currentPosts.length > 0) {
            const featuredPost = currentPosts[0];
            const featuredCard = document.createElement('article');
            featuredCard.className = 'blog-card featured';
            featuredCard.innerHTML = `
                <img src="${featuredPost.image}" alt="${featuredPost.title}">
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-tag">${featuredPost.category}</span>
                        <span class="blog-date">${featuredPost.date}</span>
                    </div>
                    <h3>${featuredPost.title}</h3>
                    <p>${featuredPost.content.substring(0, 150).replace(/<[^>]*>/g, '')}...</p>
                    <div class="blog-card-actions">
                        <a href="blog-post.html?id=${featuredPost.id}" class="btn btn-secondary">Read More</a>
                        <div class="blog-card-interaction">
                            <button class="btn-interact btn-like" aria-label="Like"><i class="far fa-heart"></i>
                                <span class="count">${featuredPost.likes}</span></button>
                            <button class="btn-interact btn-comment" aria-label="Comment"><i class="far fa-comment"></i>
                                <span class="count">${featuredPost.comments}</span></button>
                            <button class="btn-share" aria-label="Share"><i class="fas fa-share-alt"></i></button>
                        </div>
                    </div>
                </div>
            `;
            featuredCard.addEventListener('click', (e) => {
                if (e.target.closest('.btn-interact') || e.target.closest('.btn-share')) {
                    return;
                }
                window.location.href = `blog-post.html?id=${featuredPost.id}`;
            });
            container.appendChild(featuredCard);

            // Remove the featured post from the regular posts
            currentPosts.shift();
        }

        // Add the remaining posts
        currentPosts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'blog-card';
            card.innerHTML = `
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
            `;
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-interact') || e.target.closest('.btn-share')) {
                    return;
                }
                window.location.href = `blog-post.html?id=${post.id}`;
            });
            container.appendChild(card);
        });

        // Update pagination
        updatePagination(filteredPosts.length, currentPage);
    }

    function updatePagination(totalPosts, currentPage) {
        // Adjust total posts count for pagination
        // If we have a featured post, we need to adjust the total count
        const adjustedTotalPosts = totalPosts - 1; // Subtract 1 for featured post
        const pageCount = Math.ceil(adjustedTotalPosts / POSTS_PER_PAGE);

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
}); 