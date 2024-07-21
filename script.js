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

            const postSubject = document.createElement('div');
            postSubject.className = 'post-subject';
            postSubject.textContent = `Subject: ${post.subject}`;

            const postClass = document.createElement('div');
            postClass.className = 'post-class';
            postClass.textContent = `Class: ${post.class}`;

            postHeader.appendChild(postTitle);
            postHeader.appendChild(postSubject);
            postHeader.appendChild(postClass);

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
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage >= Math.ceil(filteredPosts.length / postsPerPage);

        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayPosts();
            }
        });

        nextButton.addEventListener('click', function() {
            if (currentPage < Math.ceil(filteredPosts.length / postsPerPage)) {
                currentPage++;
                displayPosts();
            }
        });
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
        document.querySelector('.close').addEventListener('click', function() {
            modal.classList.remove('show');
        });
    }

    function showProfileModal() {
        const profileModal = document.getElementById('profile-modal');
        profileModal.classList.add('show');
        document.querySelector('#profile-modal .close').addEventListener('click', function() {
            profileModal.classList.remove('show');
        });
    }

    document.getElementById('profile-icon').addEventListener('click', showProfileModal);

    function filterPosts() {
        const searchQuery = document.getElementById('search-bar').value.toLowerCase();

        filteredPosts = posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery) ||
                                  post.content.toLowerCase().includes(searchQuery);
            return matchesSearch;
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
});
