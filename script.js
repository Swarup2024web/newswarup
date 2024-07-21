document.addEventListener("DOMContentLoaded", function() {
    const posts = [
        // Your posts data
    ];

    let currentPage = 1;
    const postsPerPage = 10;

    function truncateText(text, wordLimit) {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
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

            const postTitle = document.createElement('h2');
            postTitle.textContent = post.title;

            const postDate = document.createElement('div');
            postDate.className = 'date';
            postDate.textContent = post.date;

            const postContent = document.createElement('div');
            postContent.className = 'content';
            postContent.innerHTML = truncateText(post.content, 30);

            const readMoreButton = document.createElement('span');
            readMoreButton.className = 'read-more';
            readMoreButton.textContent = 'Read more';
            readMoreButton.setAttribute('data-index', start + index);
            readMoreButton.addEventListener('click', function() {
                showModal(post.content);
            });

            postElement.appendChild(postTitle);
            postElement.appendChild(postDate);
            postElement.appendChild(postContent);
            postElement.appendChild(readMoreButton);
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

    displayPosts();
});
