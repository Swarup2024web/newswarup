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
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = i === currentPage ? 'active' : '';
            button.addEventListener('click', function() {
                currentPage = i;
                displayPosts();
            });
            pagination.appendChild(button);
        }

        // Disable previous button if on first page
        const prevButton = document.getElementById('prev-button');
        if (currentPage === 1) {
            prevButton.setAttribute('disabled', 'true');
        } else {
            prevButton.removeAttribute('disabled');
            prevButton.addEventListener('click', function() {
                currentPage--;
                displayPosts();
            });
        }

        // Disable next button if on last page
        const nextButton = document.getElementById('next-button');
        if (currentPage === totalPages) {
            nextButton.setAttribute('disabled', 'true');
        } else {
            nextButton.removeAttribute('disabled');
            nextButton.addEventListener('click', function() {
                currentPage++;
                displayPosts();
            });
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
        const selectedSubject = document.getElementById('filter-subject').value;
        const selectedClass = document.getElementById('filter-class').value;

        filteredPosts = posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery) ||
                                  post.content.toLowerCase().includes(searchQuery);
            const matchesSubject = selectedSubject === '' || post.subject === selectedSubject;
            const matchesClass = selectedClass === '' || post.class === selectedClass;
            return matchesSearch && matchesSubject && matchesClass;
        });
        currentPage = 1; // Reset to first page
        displayPosts();
    }

    function setupFilters() {
        const subjectFilter = document.getElementById('filter-subject');
        const classFilter = document.getElementById('filter-class');

        subjectFilter.addEventListener('change', filterPosts);
        classFilter.addEventListener('change', filterPosts);
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

    setupFilters();

    // Profile icon popup
    const profileIcon = document.getElementById('profile-icon');
    const profileModal = document.getElementById('profile-modal');

    profileIcon.addEventListener('click', function() {
        profileModal.classList.add('show');
    });

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            profileModal.classList.remove('show');
        });
    });
});
