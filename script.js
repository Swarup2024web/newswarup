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
            postsContainer.innerHTML = '<p>No posts found.</p>';
            updatePagination();
            return;
        }

        currentPosts.forEach(post => {
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

            const postContent = document.createElement('div');
            postContent.className = 'post-content-container';

            const { truncated, isTruncated } = truncateText(post.content, 30);
            const postContentText = document.createElement('p');
            postContentText.className = 'post-content';
            postContentText.textContent = truncated;

            const readMoreLink = document.createElement('span');
            readMoreLink.className = 'read-more';
            if (isTruncated) {
                readMoreLink.textContent = 'Read More';
                readMoreLink.addEventListener('click', function() {
                    showModal(post);
                });
            }

            postContent.appendChild(postContentText);
            postContent.appendChild(readMoreLink);

            postElement.appendChild(postHeader);
            postElement.appendChild(postContent);

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

    function fetchPosts() {
        // Replace with actual API call or data fetching logic
        posts = [
            // Example post objects
            { title: 'Post 1', subject: 'Math', class: '10', content: 'Lorem ipsum dolor sit amet...' },
            { title: 'Post 2', subject: 'Science', class: '12', content: 'Consectetur adipiscing elit...' },
            // Add more posts here
        ];
        filteredPosts = posts;
        displayPosts();
    }

    function setupFilters() {
        const subjectFilter = document.getElementById('filter-subject');
        const classFilter = document.getElementById('filter-class');

        subjectFilter.addEventListener('change', function() {
            const subject = this.value;
            filterPosts(subject, classFilter.value);
        });

        classFilter.addEventListener('change', function() {
            const classValue = this.value;
            filterPosts(subjectFilter.value, classValue);
        });
    }

    function filterPosts(subject, classValue) {
        filteredPosts = posts.filter(post => {
            return (subject === '' || post.subject === subject) &&
                   (classValue === '' || post.class === classValue);
        });
        currentPage = 1;
        displayPosts();
    }

    fetchPosts();
    setupFilters();
});
