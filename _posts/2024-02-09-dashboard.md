<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Media Chat</title>
    <style>
        .container {
            display: flex;
            justify-content: space-between;
            max-width: 800px;
            margin: auto;
        }

        .posts-container, .input-container {
            flex: 1;
            padding: 10px;
        }

        .post-container {
            border: 1px solid #ccc;
            margin-bottom: 10px;
            padding: 10px;
        }

        .input-container textarea {
            width: 100%;
            margin-bottom: 10px;
        }

        .input-container button {
            display: block;
            width: 100%;
        }

        #latestPosts {
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
                    const response = await fetch('{site.baseurl}/api/message/
', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // Include any necessary headers (e.g., authorization token)
                        },
                        body: JSON.stringify({ text: postText })
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
                const response = await fetch('{site.baseurl}/api/message/
');

                if (response.ok) {
                    const postsData = await response.json();

                    // Display posts in the front-end
                    var postsContainer = document.getElementById("posts");
                    postsContainer.innerHTML = "";  // Clear previous posts
                    postsData.forEach(post => {
                        var postElement = document.createElement("div");
                        postElement.className = "post-container";
                        postElement.innerHTML = "<p>User: " + post.text + "</p>";
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