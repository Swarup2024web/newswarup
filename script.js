document.addEventListener("DOMContentLoaded", function() {
    let posts = [];
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

        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = end >= posts.length;
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

    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayPosts();
        }
    });

    document.getElementById('next-page').addEventListener('click', function() {
        if ((currentPage * postsPerPage) < posts.length) {
            currentPage++;
            displayPosts();
        }
    });

    // Fetch posts data from the JSON file
    fetch('storage/posts.json')
        .then(response => response.json())
        .then(data => {
            posts = data;
            displayPosts();
        })
        .catch(error => console.error('Error fetching posts:', error));
});
