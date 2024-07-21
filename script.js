document.addEventListener('DOMContentLoaded', () => {
    const url = 'https://username.github.io/newswarup/storage/posts.json'; // Replace with your actual URL
    const searchBar = document.getElementById('search-bar');
    const postsContainer = document.getElementById('posts-container');
    
    function renderPosts(posts) {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
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

    fetch(url)
        .then(response => response.json())
        .then(data => {
            renderPosts(data);

            searchBar.addEventListener('input', (event) => {
                const query = event.target.value.toLowerCase();
                const filteredPosts = data.filter(post => 
                    post.title.toLowerCase().includes(query) || 
                    post.content.toLowerCase().includes(query)
                );
                renderPosts(filteredPosts);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
