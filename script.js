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
            postSubjectClass.innerHTML = `Subject: ${post.subject} &#8226; Class: ${post.class}`;

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

        updateNavigation();
    }

    function updateNavigation() {
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(filteredPosts.length / postsPerPage);

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
        const modal = document.getElementById('profile-modal');
        modal.classList.add('show');
        document.querySelector('.close').addEventListener('click', function() {
            modal.classList.remove('show');
        });
    }

    document.getElementById('profile-icon').addEventListener('click', showProfileModal);

    document.getElementById('search-bar').addEventListener('input', function() {
        const searchQuery = this.value.toLowerCase();
        filteredPosts = posts.filter(post => 
            post.title.toLowerCase().includes(searchQuery) ||
            post.content.toLowerCase().includes(searchQuery)
        );
        currentPage = 1; // Reset to first page
        displayPosts();
    });

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
