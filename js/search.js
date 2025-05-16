// Blog search functionality
import { blogPosts } from './blog-data.js';

// Pagination state
let currentPage = 1;
const postsPerPage = 4;
let currentResults = [];
let searchTimeout = null;

document.addEventListener('DOMContentLoaded', function () {
    // Get all search forms on the page
    const searchForms = document.querySelectorAll('.search-form');

    // Add event listener to each search form
    searchForms.forEach(form => {
        form.addEventListener('submit', handleSearch);
        // Add input event listener for real-time search
        const input = form.querySelector('input[type="search"]');
        if (input) {
            input.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    handleSearch(e);
                }, 300); // Debounce search for 300ms
            });
        }
    });

    // Check if we're on a search results page
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    const page = parseInt(urlParams.get('page')) || 1;
    currentPage = page;

    if (searchQuery && window.location.pathname.includes('search-results.html')) {
        // Display search results
        displaySearchResults(searchQuery);

        // Update search input with the query
        document.querySelectorAll('.search-form input').forEach(input => {
            input.value = searchQuery;
        });
    }
});

// Handle search form submission
function handleSearch(e) {
    e.preventDefault();

    // Get search query
    const searchInput = e.target.querySelector('input[type="search"]');
    const query = searchInput.value.trim();

    if (!query) return; // Don't search for empty strings

    // Redirect to search results page with query parameter
    window.location.href = `search-results.html?q=${encodeURIComponent(query)}&page=1`;
}

// Function to display search results
function displaySearchResults(query) {
    // Show loading state
    const resultsContainer = document.getElementById('search-results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Searching for blog posts...</p>
            </div>
        `;
    }

    // Use setTimeout to allow the loading indicator to show
    setTimeout(() => {
        // Normalize the search query
        const normalizedQuery = query.toLowerCase().trim();
        const searchTerms = normalizedQuery.split(/\s+/);

        // Filter and rank blog posts based on the query
        currentResults = Object.entries(blogPosts).map(([id, post]) => {
            let score = 0;
            let matchDetails = {
                titleMatch: false,
                exactTitleMatch: false,
                contentMatch: false,
                authorMatch: false,
                categoryMatch: false,
                tagMatch: false
            };

            // Check for exact title match (highest priority)
            if (post.title.toLowerCase() === normalizedQuery) {
                score += 100;
                matchDetails.exactTitleMatch = true;
            }
            // Check for title containing the query
            else if (post.title.toLowerCase().includes(normalizedQuery)) {
                score += 50;
                matchDetails.titleMatch = true;
            }
            // Check for individual terms in the title
            else {
                const titleWords = post.title.toLowerCase().split(/\s+/);
                for (const term of searchTerms) {
                    if (titleWords.includes(term)) {
                        score += 20;
                        matchDetails.titleMatch = true;
                    }
                }
            }

            // Check for category match
            if (post.category.toLowerCase() === normalizedQuery) {
                score += 40;
                matchDetails.categoryMatch = true;
            } else if (post.category.toLowerCase().includes(normalizedQuery)) {
                score += 30;
                matchDetails.categoryMatch = true;
            }

            // Check for author match
            if (post.author.toLowerCase().includes(normalizedQuery)) {
                score += 25;
                matchDetails.authorMatch = true;
            }

            // Check for content match
            if (post.content.toLowerCase().includes(normalizedQuery)) {
                score += 15;
                matchDetails.contentMatch = true;
            } else {
                // Check for individual terms in content
                for (const term of searchTerms) {
                    if (term.length > 2 && post.content.toLowerCase().includes(term)) {
                        score += 5;
                        matchDetails.contentMatch = true;
                    }
                }
            }

            // Check for tag matches
            if (post.tags) {
                const exactTagMatch = post.tags.some(tag => tag.toLowerCase() === normalizedQuery);
                const partialTagMatch = post.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));

                if (exactTagMatch) {
                    score += 35;
                    matchDetails.tagMatch = true;
                } else if (partialTagMatch) {
                    score += 25;
                    matchDetails.tagMatch = true;
                }
            }

            // Return the post with its score and match details
            return { id, post, score, matchDetails };
        }).filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);

        // Truncate long search queries to display only first 15 words
        let displayQuery = query;
        const words = query.split(' ');
        if (words.length > 15) {
            displayQuery = words.slice(0, 15).join(' ') + '...';
        }

        // Update the search results heading
        const resultsHeading = document.getElementById('search-results-heading');
        if (resultsHeading) {
            resultsHeading.innerHTML = `Search Results for "<span>${displayQuery}</span>"`;
        }

        // Update result count
        const resultCountElement = document.getElementById('result-count');
        if (resultCountElement) {
            resultCountElement.textContent = `Found ${currentResults.length} result${currentResults.length !== 1 ? 's' : ''}`;
        }

        if (!resultsContainer) return;

        if (currentResults.length === 0) {
            showNoResultsMessage('No blog posts found matching your search.');
            return;
        }

        // Calculate pagination
        const totalPages = Math.ceil(currentResults.length / postsPerPage);
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const paginatedResults = currentResults.slice(startIndex, endIndex);

        // Clear previous results
        resultsContainer.innerHTML = '';

        // Add results to the container
        paginatedResults.forEach(({ id, post, matchDetails }) => {
            // Create a preview of the content by stripping HTML tags and truncating
            const contentPreview = post.content
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .substring(0, 200) // Truncate to 200 characters
                .trim() + '...'; // Add ellipsis

            // Highlight the match reason with priority: Title > Category > Tag > Content
            let matchReason = '';
            if (matchDetails.exactTitleMatch) {
                matchReason = '<span class="match-reason exact-match">Exact Title Match</span>';
            } else if (matchDetails.titleMatch) {
                matchReason = '<span class="match-reason">Title Match</span>';
            } else if (matchDetails.categoryMatch) {
                matchReason = '<span class="match-reason">Category Match</span>';
            } else if (matchDetails.tagMatch) {
                matchReason = '<span class="match-reason">Tag Match</span>';
            } else if (matchDetails.contentMatch) {
                matchReason = '<span class="match-reason content-match">Content Match</span>';
            }

            const resultHTML = `
                <article class="search-result">
                    <div class="search-result-image">
                        <img src="${post.image}" alt="${post.title}" loading="lazy">
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-meta">
                            <span class="blog-tag">${post.category}</span>
                            <span class="blog-date">${post.date}</span>
                            <span class="blog-author">${post.author}</span>
                            ${matchReason}
                        </div>
                        <h3><a href="blog-post.html?id=${id}">${post.title}</a></h3>
                        <p>${contentPreview}</p>
                        <div class="search-result-actions">
                            <a href="blog-post.html?id=${id}" class="btn btn-secondary">Read More</a>
                            <div class="search-result-interaction">
                                <button class="btn-interact btn-like" aria-label="Like"><i class="far fa-heart"></i>
                                    <span class="count">${post.likes || 0}</span></button>
                                <button class="btn-interact btn-comment" aria-label="Comment"><i class="far fa-comment"></i>
                                    <span class="count">${post.comments || 0}</span></button>
                                <button class="btn-share" aria-label="Share"><i class="fas fa-share-alt"></i></button>
                            </div>
                        </div>
                    </div>
                </article>
            `;

            resultsContainer.innerHTML += resultHTML;
        });

        // Add pagination controls
        if (totalPages > 1) {
            const paginationHTML = createPaginationControls(currentPage, totalPages, query);
            resultsContainer.insertAdjacentHTML('afterend', paginationHTML);

            // Add event listeners to pagination buttons
            const paginationButtons = document.querySelectorAll('.pagination-btn');
            paginationButtons.forEach(button => {
                if (!button.classList.contains('active')) {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const page = parseInt(button.textContent);
                        if (!isNaN(page)) {
                            window.location.href = `search-results.html?q=${encodeURIComponent(query)}&page=${page}`;
                        } else if (button.classList.contains('prev')) {
                            window.location.href = `search-results.html?q=${encodeURIComponent(query)}&page=${currentPage - 1}`;
                        } else if (button.classList.contains('next')) {
                            window.location.href = `search-results.html?q=${encodeURIComponent(query)}&page=${currentPage + 1}`;
                        }
                    });
                }
            });
        }
    }, 100); // Small delay to ensure smooth loading indicator
}

function createPaginationControls(currentPage, totalPages, query) {
    let paginationHTML = '<div class="pagination">';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <a href="search-results.html?q=${encodeURIComponent(query)}&page=${currentPage - 1}" 
               class="pagination-btn prev">
                <i class="fas fa-chevron-left"></i> Previous
            </a>
        `;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<span class="pagination-btn active">${i}</span>`;
        } else {
            paginationHTML += `
                <a href="search-results.html?q=${encodeURIComponent(query)}&page=${i}" 
                   class="pagination-btn">${i}</a>
            `;
        }
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `
            <a href="search-results.html?q=${encodeURIComponent(query)}&page=${currentPage + 1}" 
               class="pagination-btn next">
                Next <i class="fas fa-chevron-right"></i>
            </a>
        `;
    }

    paginationHTML += '</div>';
    return paginationHTML;
}

function showNoResultsMessage(message) {
    const resultsContainer = document.getElementById('search-results-container');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <h3>No Results Found</h3>
            <p>${message}</p>
            <p>Try adjusting your search terms or browse our <a href="blog.html">blog categories</a> instead.</p>
        </div>
    `;

    const resultCountElement = document.getElementById('result-count');
    if (resultCountElement) {
        resultCountElement.textContent = '0 results';
    }
} 