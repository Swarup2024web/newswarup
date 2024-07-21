document.addEventListener('DOMContentLoaded', () => {
    const readMoreLinks = document.querySelectorAll('.read-more');

    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const post = link.parentElement;
            post.classList.toggle('expanded');
            if (post.classList.contains('expanded')) {
                link.textContent = 'Read Less';
            } else {
                link.textContent = 'Read More';
            }
        });
    });
});
