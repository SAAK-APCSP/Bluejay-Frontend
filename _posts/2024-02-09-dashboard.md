---
comments: True
layout: post
toc: false
title: Dashboard
permalink: /dashboard
type: hacks
courses: { "compsci": { "week": 2 } }
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Media Chat</title>
    <style>
        #posts {
            width: 300px;
            border: 1px solid #ccc;
            overflow-y: scroll;
            padding: 10px;
        }

        #postInput {
            width: 100%;
            margin-top: 10px;
        }

        #postButton {
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div id="posts"></div>
    <textarea id="postInput" placeholder="Type your post..."></textarea>
    <button id="postButton" onclick="createPost()">Post</button>

    <script>
        async function createPost() {
            var postInput = document.getElementById("postInput");
            var postsContainer = document.getElementById("posts");

            var postText = postInput.value;

            if (postText.trim() !== "") {
                try {
                    // Assuming you have a POST endpoint for creating posts
                    const response = await fetch('https://your-api-url/posts', {
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
                const response = await fetch('https://your-api-url/posts');

                if (response.ok) {
                    const postsData = await response.json();

                    // Display posts in the front-end
                    var postsContainer = document.getElementById("posts");
                    postsContainer.innerHTML = "";
                    postsData.forEach(post => {
                        var postElement = document.createElement("div");
                        postElement.innerHTML = "<p>User: " + post.text + "</p>";
                        postsContainer.appendChild(postElement);
                    });
                } else {
                    console.error('Failed to fetch posts');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // Fetch and display posts when the page loads
        fetchPosts();
    </script>
</body>
</html>
