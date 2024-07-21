document.addEventListener("DOMContentLoaded", function() {
    let posts = [];
    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
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
        const currentPosts = posts.slice(start, end);

        currentPosts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.className = 'post';

            const postHeader = document.createElement('div');
            postHeader.className = 'post-header';

            const postTitle = document.createElement('div');
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

            const truncatedContent = truncateText(post.content, 30);
            const postContent = document.createElement('div');
            postContent.className = 'post-content';
            postContent.innerHTML = truncatedContent.truncated;

            postContentContainer.appendChild(postContent);

            postElement.appendChild(postHeader);
            postElement.appendChild(postContentContainer);

            if (truncatedContent.isTruncated) {
                const readMoreButton = document.createElement('span');
                readMoreButton.className = 'read-more';
                readMoreButton.textContent = 'Read more';
                readMoreButton.setAttribute('data-index', start + index);
                readMoreButton.addEventListener('click', function() {
                    showModal(post.content);
                });
                postContentContainer.appendChild(readMoreButton);
            }

            postsContainer.appendChild(postElement);
        });

        updatePagination();
    }

    function updatePagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        const totalPages = Math.ceil(posts.length / postsPerPage);
        const createButton = (page) => {
            const button = document.createElement('button');
            button.textContent = page;
            button.className = (page === currentPage) ? 'active' : '';
            button.addEventListener('click', function() {
                currentPage = page;
                localStorage.setItem('currentPage', currentPage);
                displayPosts();
            });
            return button;
        };

        if (currentPage > 1) {
            const prevButton = createButton(currentPage - 1);
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', function() {
                currentPage--;
                localStorage.setItem('currentPage', currentPage);
                displayPosts();
            });
            pagination.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            pagination.appendChild(createButton(i));
        }

        if (currentPage < totalPages) {
            const nextButton = createButton(currentPage + 1);
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', function() {
                currentPage++;
                localStorage.setItem('currentPage', currentPage);
                displayPosts();
            });
            pagination.appendChild(nextButton);
        }
    }

    function showModal(content) {
        const modal = document.getElementById('post-modal');
        const modalContent = document.getElementById('modal-post-content');
        modalContent.innerHTML = content;
        modal.style.display = "block";

        const closeModal = document.getElementsByClassName('close')[0];
        closeModal.onclick = function() {
            modal.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }

    // Initialize pagination and posts
    document.getElementById('pagination').addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            const page = parseInt(event.target.textContent);
            if (!isNaN(page)) {
                currentPage = page;
                localStorage.setItem('currentPage', currentPage);
                displayPosts();
            }
        }
    });

    // Fetch posts data from the JSON file
    fetch('storage/posts.json')
        .then(response => response.json())
        .then(data => {
            posts = data;
            displayPosts();
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            document.getElementById('posts-container').innerHTML = '<p>Failed to load posts. Please try again later.</p>';
        });
});
