document.addEventListener('DOMContentLoaded', () => {
    const url = 'https://swarup2024web.github.io/newswarup/storage/posts.json'; // Replace with your actual URL

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('posts-container');
            data.forEach(post => {
                const article = document.createElement('article');
                article.className = 'post';
                article.innerHTML = `
                    <h2>${post.title}</h2>
                    <p class="date">${post.date}</p>
                    <p>${post.content}</p>
                    <a href="${post.url}" class="read-more">Read More</a>
                `;
                container.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
