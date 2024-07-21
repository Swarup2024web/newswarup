document.addEventListener("DOMContentLoaded", function() {
    let posts = [];
    let filteredPosts = [];
    let currentPage = 1;
    const postsPerPage = 10;

    function truncateText(text, wordLimit) {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return {
                truncated: words.slice(0, wordLimit).join(' ') + '...',
                isTruncated: true
            };
        }
        return {
            truncated: text,
            isTruncated: false
        };
    }

    function displayPosts() {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const currentPosts = filteredPosts.slice(start, end);

        if (currentPosts.length === 0) {
            postsContainer.innerHTML = '<p>No posts available.</p>';
            return;
        }

        currentPosts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.className = 'post';

            const postHeader = document.createElement('div');
            postHeader.className = 'post-header';

            const postTitle = document.createElement('h2');
            postTitle.className = 'post-title';
            postTitle.textContent = post.title;

            const postSubjectClass = document.createElement('div');
            postSubjectClass.className = 'post-subject-class';
            postSubjectClass.innerHTML = `<span class="post-subject">Subject: ${post.subject}</span> &bull; <span class="post-class">Class: ${post.class}</span>`;

            postHeader.appendChild(postTitle);
            postHeader.appendChild(postSubjectClass);

            const postContentContainer = document.createElement('div');
            postContentContainer.className = 'post-content-container';

            const { truncated, isTruncated } = truncateText(post.content, 30);
            const postContent = document.createElement('p');
            postContent.className = 'post-content';
            postContent.textContent = truncated;

            const readMoreLink = document.createElement('span');
            readMoreLink.className = 'read-more';
            if (isTruncated) {
                readMoreLink.textContent = 'Read More';
                readMoreLink.addEventListener('click', function() {
                    showModal(post);
                });
            }

            postContentContainer.appendChild(postContent);
            postContentContainer.appendChild(readMoreLink);

            postElement.appendChild(postHeader);
            postElement.appendChild(postContentContainer);

            postsContainer.appendChild(postElement);
        });

        updatePagination();
    }

    function updatePagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', function() {
                currentPage--;
                displayPosts();
            });
            pagination.appendChild(prevButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', function() {
                currentPage++;
                displayPosts();
            });
            pagination.appendChild(nextButton);
        }
    }

    function showModal(post) {
        const modal = document.getElementById('post-modal');
        const modalContent = document.getElementById('modal-post-content');

        modalContent.innerHTML = `
            <h2>${post.title}</h2>
            <p><strong>Subject:</strong> ${post.subject}</p>
            <p><strong>Class:</strong> ${post.class}</p>
            <p>${post.content}</p>
        `;

        modal.classList.add('show');
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('show');
            });
        });
    }

    function filterPosts() {
        const searchQuery = document.getElementById('search-bar').value.toLowerCase();

        filteredPosts = posts.filter(post => {
            return post.title.toLowerCase().includes(searchQuery) ||
                   post.content.toLowerCase().includes(searchQuery);
        });
        currentPage = 1; // Reset to first page
        displayPosts();
    }

    document.getElementById('search-bar').addEventListener('input', filterPosts);

    // Fetch posts data from the JSON file
    fetch('storage/posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            posts = data;
            filteredPosts = posts; // Initialize filteredPosts with all posts
            displayPosts();
        })
        .catch(error => console.error('Error fetching posts:', error));

    // Profile icon modal functionality
    document.getElementById('profile-icon').addEventListener('click', function() {
        const profileModal = document.getElementById('profile-modal');
        profileModal.classList.add('show');
    });

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => modal.classList.remove('show'));
        });
    });
});
