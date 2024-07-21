document.addEventListener('DOMContentLoaded', () => {
    const url = 'https://username.github.io/newswarup/storage/posts.json'; // Replace with your actual URL
    const searchBar = document.getElementById('search-bar');
    const postsContainer = document.getElementById('posts-container');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    
    let posts = [];
    let currentPage = 1;
    const postsPerPage = 10;
    
    function renderPosts(postsToRender) {
        postsContainer.innerHTML = '';
        postsToRender.forEach(post => {
            const article = document.createElement('article');
            article.className = 'post';
            article.innerHTML = `
                <h2>${post.title}</h2>
                <p class="date">${post.date}</p>
                <p>${post.content}</p>
                <a href="${post.url}" class="read-more">Read More</a>
            `;
            postsContainer.appendChild(article);
        });
    }

    function updatePagination() {
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage * postsPerPage >= posts.length;
    }

    function displayPage(page) {
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;
        const pagePosts = posts.slice(start, end);
        renderPosts(pagePosts);
        updatePagination();
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            posts = data;
            displayPage(currentPage);

            searchBar.addEventListener('input', (event) => {
                const query = event.target.value.toLowerCase();
                const filteredPosts = data.filter(post => 
                    post.title.toLowerCase().includes(query) || 
                    post.content.toLowerCase().includes(query)
                );
                posts = filteredPosts;
                currentPage = 1;
                displayPage(currentPage);
            });

            prevPageButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    displayPage(currentPage);
                }
            });

            nextPageButton.addEventListener('click', () => {
                if (currentPage * postsPerPage < posts.length) {
                    currentPage++;
                    displayPage(currentPage);
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
