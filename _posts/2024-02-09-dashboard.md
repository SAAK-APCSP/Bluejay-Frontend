<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Media Chat</title>
    <style>
        @keyframes strobe {
            0%, 20%, 50%, 80%, 100% {
                border-color: #FF0000; /* Red */
            }
            40% {
                border-color: #FF7F00; /* Orange */
            }
            60% {
                border-color: #FFFF00; /* Yellow */
            }
            80% {
                border-color: #00FF00; /* Green */
            }
        }
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #171515;
            color: #39FF14;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }
        .login-container {
            border-radius: 15px;
            padding: 20px;
            border: 5px solid transparent;
            background-clip: padding-box;
            background-color: #171515;
            color: #39FF14;
            animation: strobe 2s infinite; /* Apply strobe light effect to the border */
            width: 300px; /* Adjusted width */
            margin: auto; /* Center the login container */
            margin-bottom: 20px; /* Add margin at the bottom */
        }
        .container {
            display: flex;
            flex-direction: column-reverse; /* Reverse the order of the posts */
            max-width: 800px;
            margin: auto;
            padding: 20px;
            flex: 1; /* Take remaining space */
        }
        .input-container,
        .posts-container {
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
        .post-container {
            position: relative;
            border: 1px solid #ccc;
            margin-bottom: 10px;
            padding: 10px;
            background-color: #000; /* Black background color */
            color: #fff; /* Text color */
        }
        .post-content {
            margin: 0; /* Remove default margin for <p> */
        }
    </style>
</head>
<body onload="fetchPosts();">
    <div class="container">
        <div class="input-container">
        <form action="javascript:createPost()" id="postButton">
            <h2>Post Your Message</h2>
            <input type="text" id="uid" placeholder="Enter UID...">
            <textarea id="message" placeholder="Type your post..."></textarea>
            <button id="postButton">Post</button>
        </form>
        </div>
        <div class="posts-container" id="postsWrapper">
            <h2>Posts</h2>
            <input type="text" id="searchInput" oninput="searchPosts()" placeholder="Search posts...">
            <div id="posts"></div>
        </div>
    </div>
    <div id="latestPosts" class="latest-posts"></div>
   <script>
    function createPost() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const uid = document.getElementById("uid").value;
        const message = document.getElementById("message").value;
        const body = {
            uid: uid,
            message: message,
            likes: 0
        };
        const authOptions = {
            method: 'POST',
            cache: 'no-cache',
            headers: myHeaders,
            body: JSON.stringify(body),
            credentials: 'include'
        };
        fetch('http://127.0.0.1:8086/api/messages/send', authOptions)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to create post:', response.status);
                    return null;
                }
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                if (data !== null) {
                    console.log('Response:', data);
                    // Update the posts container with the new post
                    updatePostsContainer(uid, message, 0);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function fetchPosts() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const authOptions = {
            method: 'GET',
            cache: 'no-cache',
            headers: myHeaders,
            credentials: 'include'
        };
        fetch('http://127.0.0.1:8086/api/messages/', authOptions)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to fetch posts:', response.status);
                    return null;
                }
                return response.json();
            })
            .then(posts => {
                if (posts === null || posts === undefined) {
                    console.warn('Received null or undefined posts.');
                    alert('Please Log in first!')
                    return;
                }
                console.log('Fetched Posts:', posts);
                displayPosts(posts);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function displayPosts(posts) {
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = ''; // Clear existing posts
        posts.forEach(post => {
            updatePostsContainer(post.uid, post.message, post.likes);
        });
    }
    function updatePostsContainer(uid, message, likes) {
    const postsContainer = document.getElementById('posts');
    const postDiv = document.createElement('div');
    postDiv.className = 'post-container';
    const postContent = document.createElement('p');
    postContent.className = 'post-content';
    postContent.textContent = `UID: ${uid}, Message: ${message}`;
    const replyButton = document.createElement('button');
    replyButton.textContent = 'Reply';
    replyButton.addEventListener('click', () => showReplyForm(uid));
    const likeButton = document.createElement('button'); // Like button
    likeButton.textContent = 'Like';
    likeButton.addEventListener('click', () => {
        likePost(uid, message);
        // Hide the like button after clicking
        likeButton.style.display = 'none';
    });
    const likesCountSpan = document.createElement('span');
    likesCountSpan.className = 'likes-count';
    likesCountSpan.textContent = `${likes} 👍`; // Display likes count
    postDiv.appendChild(postContent);
    postDiv.appendChild(replyButton);
    postDiv.appendChild(likeButton);
    postDiv.appendChild(likesCountSpan); // Include likes count
    postsContainer.appendChild(postDiv);
}
    function showReplyForm(parentUID) {
        const replyFormContainer = document.getElementById('replyFormContainer');
        replyFormContainer.innerHTML = ''; // Clear existing content
        const replyForm = document.createElement('form');
        replyForm.className = 'reply-form-container';
        replyForm.innerHTML = `
            <h3>Reply to UID: ${parentUID}</h3>
            <textarea id="replyMessage" placeholder="Type your reply..."></textarea>
            <button type="button" onclick="postReply('${parentUID}')">Post Reply</button>
        `;
        replyFormContainer.appendChild(replyForm);
    }
    function postReply(parentUID) {
        const replyMessage = document.getElementById('replyMessage').value;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const body = {
            uid: parentUID,
            message: replyMessage,
            likes: 0
        };
        const authOptions = {
            method: 'POST',
            cache: 'no-cache',
            headers: myHeaders,
            body: JSON.stringify(body),
            credentials: 'include'
        };
        fetch('http://127.0.0.1:8086/api/messages/send', authOptions)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to create reply:', response.status);
                    return null;
                }
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                if (data !== null) {
                    console.log('Reply Response:', data);
                    // Clear the reply form after posting
                    const replyFormContainer = document.getElementById('replyFormContainer');
                    replyFormContainer.innerHTML = '';
                    // Fetch and update posts after posting a reply
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function likePost(uid, message) {
        // Increment the like count in the DOM immediately
        const likesCountSpan = document.querySelector(`.post-container[data-uid="${uid}"] .likes-count`);
        if (likesCountSpan) {
            var currentLikes = parseInt(likesCountSpan.textContent, 10) || 0;
            likesCountSpan.textContent = `${currentLikes + 1} 👍`;
        }
        // Now, send the request to the server to update likes
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        // Prepare the request body
        const body = {
            message: message,
        };
        const authOptions = {
            method: 'PUT', // Assuming you are using a PUT request to update likes
            cache: 'no-cache',
            headers: myHeaders,
            body: JSON.stringify(body),
            credentials: 'include'
        };
        fetch(`http://127.0.0.1:8086/api/messages/like`, authOptions)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to like post:', response.status);
                    // Revert the like count in case of an error
                    if (likesCountSpan) {
                        likesCountSpan.textContent = `${currentLikes} 👍`;
                    }
                    return null;
                }
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                if (data !== null) {
                    console.log('Like Response:', data);
                    // Update the like count in the DOM if needed
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function searchPosts() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const postsContainer = document.getElementById('posts');
        const allPosts = postsContainer.querySelectorAll('.post-container');
        allPosts.forEach(post => {
            const postContent = post.querySelector('.post-content').textContent.toLowerCase();
            if (postContent.includes(searchInput)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    }
</script>

<!-- Add a container for the reply form -->
<div id="replyFormContainer"></div>
