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

        if (totalPages <= 1) return; // No need for pagination if there's only one page

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayPosts();
            }
        });
        pagination.appendChild(prevButton);

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

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                displayPosts();
            }
        });
        pagination.appendChild(nextButton);
    }

    function showModal(post) {
        const modal = document.getElementById('profile-modal');
        const modalContent = document.querySelector('#profile-modal .modal-content');

        modalContent.innerHTML = `
            <h2>${post.title}</h2>
            <p><strong>Subject:</strong> ${post.subject}</p>
            <p><strong>Class:</strong> ${post.class}</p>
            <p>${post.content}</p>
        `;

        modal.classList.add('show');
    }

    function hideModal() {
        const modal = document.getElementById('profile-modal');
        modal.classList.remove('show');
    }

    document.getElementById('profile-icon').addEventListener('click', function() {
        showModal({
            title: "Random Header",
            subject: "Random Subject",
            class: "Random Class",
            content: "This is some random text to show in the modal popup. You can replace this with any information you like."
        });
    });

    document.getElementById('profile-close').addEventListener('click', hideModal);

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
