<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Media Chat</title>
    <style lang="scss">
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        $primary-color: #007bff;
        $secondary-color: #6c757d;

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f8f9fa;
            color: #333;
        }

        .container {
            display: flex;
            justify-content: space-between;
            max-width: 800px;
            margin: auto;
            padding: 20px;
        }

        .input-container,
        .posts-container {
            flex: 1;
            padding: 10px;
        }

        .post-container {
            position: relative;
            border: 1px solid #ccc;
            margin-bottom: 10px;
            padding: 10px;
            background-color: #fff;
        }

        .post-actions {
            position: absolute;
            top: 10px;
            right: 10px;
        }

        .post-actions button {
            margin-right: 5px;
            cursor: pointer;
            background-color: transparent;
            border: none;
        }

        .input-container textarea {
            width: 100%;
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ccc;
            resize: vertical;
        }

        .input-container button {
            display: block;
            width: 100%;
            padding: 10px;
            background-color: $primary-color;
            color: #fff;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .input-container button:hover {
            background-color: darken($primary-color, 10%);
        }

        .latest-posts {
            margin-top: 20px;
            border-top: 1px solid #ccc;
            padding-top: 20px;
        }

        .latestPost {
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="input-container">
            <h2>Post Your Message</h2>
            <textarea id="postInput" placeholder="Type your post..."></textarea>
            <button id="postButton" onclick="createPost()">Post</button>
        </div>
        <div class="posts-container">
            <h2>Posts</h2>
            <div id="posts"></div>
        </div>
    </div>

    <div id="latestPosts" class="latest-posts"></div>

    <script>
        // Define an object to store the latest post from each user
        let latestPosts = {};

        async function createPost() {
            var postInput = document.getElementById("postInput");
            var postsContainer = document.getElementById("posts");

            var postText = postInput.value;

            if (postText.trim() !== "") {
                try {
                    // Assuming you have a POST endpoint for creating posts
                    const response = await fetch('{site.baseurl}/api/message/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // Include any necessary headers (e.g., authorization token)
                        },
                        body: JSON.stringify({ text: postText, likes: 0, dislikes: 0 }) // Initialize likes and dislikes
                    });

                    if (response.ok) {
                        // Post successfully created, now fetch and display all posts
                        fetchPosts();
                        // Clear the input field after creating the post
                        postInput.value = "";
                    } else {
                        console.error('Failed to create post');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }

        async function fetchPosts() {
            try {
                // Assuming you have a GET endpoint for fetching posts
                const response = await fetch('{site.baseurl}/api/message/');

                if (response.ok) {
                    const postsData = await response.json();

                    // Display posts in the front-end
                    var postsContainer = document.getElementById("posts");
                    postsContainer.innerHTML = "";  // Clear previous posts
                    postsData.forEach(post => {
                        var postElement = document.createElement("div");
                        postElement.className = "post-container";
                        postElement.innerHTML = "<p>User: " + post.text + "</p>" +
                            "<div class='post-actions'>" +
                            "<button onclick='likePost(" + post.id + ")'>Like</button>" +
                            "<span id='likeCount" + post.id + "'>" + post.likes + "</span>" +
                            "<button onclick='dislikePost(" + post.id + ")'>Dislike</button>" +
                            "<span id='dislikeCount" + post.id + "'>" + post.dislikes + "</span>" +
                            "</div>";
                        postsContainer.appendChild(postElement);

                        // Update latest post for each user
                        latestPosts[post.userId] = post.text;
                    });

                    // Update latest posts box
                    updateLatestPostsBox();
                } else {
                    console.error('Failed to fetch posts');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function likePost(postId) {
            try {
                // Assuming you have a PUT endpoint for updating posts
                const response = await fetch('{site.baseurl}/api/message/' + postId + '/like', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include any necessary headers (e.g., authorization token)
                    },
                    body: JSON.stringify({ action: 'like' })
                });

                if (response.ok) {
                    // Post liked successfully, fetch and display posts again
                    fetchPosts();
                } else {
                    console.error('Failed to like post');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function dislikePost(postId) {
            try {
                // Assuming you have a PUT endpoint for updating posts
                const response = await fetch('{site.baseurl}/api/message/' + postId + '/dislike', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include any necessary headers (e.g., authorization token)
                    },
                    body: JSON.stringify({ action: 'dislike' })
                });

                if (response.ok) {
                    // Post disliked successfully, fetch and display posts again
                    fetchPosts();
                } else {
                    console.error('Failed to dislike post');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function updateLatestPostsBox() {
            var latestPostsContainer = document.getElementById("latestPosts");
            latestPostsContainer.innerHTML = "";  // Clear previous latest posts

            // Display latest post from each user
            Object.keys(latestPosts).forEach(userId => {
                var latestPostElement = document.createElement("div");
                latestPostElement.className = "latestPost";
                latestPostElement.innerHTML = "<p>User " + userId + ": " + latestPosts[userId] + "</p>";
                latestPostsContainer.appendChild(latestPostElement);
            });
        }

        // Fetch and display posts when the page loads
        fetchPosts();
    </script>
</body>
</html>
