document.addEventListener("DOMContentLoaded", function() {
    // Modal functionality
    var modal = document.getElementById("profile-modal");
    var profileIcon = document.getElementById("profile-icon");
    var span = document.getElementById("profile-close");

    profileIcon.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Fetch and display posts
    function fetchPosts(page = 1) {
        // Dummy posts data
        const posts = [
            // Add your post data here
        ];
        const postsPerPage = 10;
        const totalPages = Math.ceil(posts.length / postsPerPage);
        
        let postsContainer = document.getElementById("posts-container");
        postsContainer.innerHTML = "";

        let start = (page - 1) * postsPerPage;
        let end = start + postsPerPage;
        let paginatedPosts = posts.slice(start, end);

        paginatedPosts.forEach(post => {
            let postElement = document.createElement("div");
            postElement.className = "post";
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
            `;
            postsContainer.appendChild(postElement);
        });

        // Display pagination
        let pagination = document.getElementById("pagination");
        pagination.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            let pageButton = document.createElement("button");
            pageButton.innerText = i;
            pageButton.classList.toggle("active", i === page);
            pageButton.onclick = () => fetchPosts(i);
            pagination.appendChild(pageButton);
        }
    }

    fetchPosts();
});
