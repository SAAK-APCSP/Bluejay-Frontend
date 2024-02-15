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
            justify-content: center;
            align-items: center;
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
        }

        input[type=text], input[type=password] {
            width: 100%;
            padding: 12px 20px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #39FF14;
            box-sizing: border-box;
            background-color: #171515;
            color: #39FF14;
        }

        button {
            background-color: #39FF14;
            color: #171515;
            padding: 14px 20px;
            margin: 8px 0;
            border: none;
            cursor: pointer;
            width: 100%; /* Adjusted width */
        }

        button:hover {
            opacity: 0.8;
        }

        span.psw {
            display: block;
            text-align: center;
            margin-top: 16px;
            color: #39FF14;
        }

        @media screen and (max-width: 300px) {
            span.psw {
                display: block;
                float: none;
            }
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
<body>
    <div class="container">
        <div class="input-container">
        <form action="javascript:createPost()" id="postButton">
            <h2>Post Your Message</h2>
            <input type="text" id="uid" placeholder="Enter UID...">
            <textarea id="message" placeholder="Type your post..."></textarea>
            <button id="postButton">Post</button>
        </form>
        </div>
        <div class="posts-container">
            <h2>Posts</h2>
            <div id="posts"></div>
        </div>
    </div>
    <div id="latestPosts" class="latest-posts"></div>
    <script>
        // function createPost() {
        //     var myHeaders = new Headers();
        //     myHeaders.append("Content-Type", "application/json");
        //     const body = {
        //         uid: document.getElementById("uid").value,
        //         message: document.getElementById("message").value
        //     };
        //     const authOptions = {
        //         method: 'POST',
        //         cache: 'no-cache',
        //         headers: myHeaders,
        //         body: JSON.stringify(body),
        //         credentials: 'include'
        //     };
        //     fetch('http://127.0.0.1:8086/api/messages/send', authOptions)
        //         .then(response => {
        //             if (!response.ok) {
        //                 console.error('Failed to create post:', response.status);
        //                 return null;
        //             }
        //             const contentType = response.headers.get('Content-Type');
        //             if (contentType && contentType.includes('application/json')) {
        //                 return response.json();
        //             } else {
        //                 return response.text();
        //             }
        //         })
        //         .then(data => {
        //             if (data !== null) {
        //                 console.log('Response:', data);
        //                 fetchPosts();
        //             }
        //         })
        //         .catch(error => {
        //             console.error('Error:', error);
        //         });
        // }
        // function fetchPosts() {
        //     // Implement the code to fetch and display posts
        // }
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
            fetch('http://127.0.0.1:8086/api/messages')
                .then(response => {
                    if (!response.ok) {
                        console.error('Failed to fetch posts:', response.status);
                        return null;
                    }
                    return response.json();
                })
                .then(posts => {
                    if (posts !== null) {
                        displayPosts(posts);
                    }
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
            likeButton.addEventListener('click', () => likePost(uid));
            const likesCountSpan = document.createElement('span');
            likesCountSpan.className = 'likes-count';
            likesCountSpan.textContent = `${likes} Likes`; // Display likes count
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
            // You can now send the replyMessage and parentUID to your server
            // Similar to the createPost function
            // Remember to update the server-side code to handle replies
            // For demonstration, let's just log the reply message
            console.log(`Reply to UID ${parentUID}: ${replyMessage}`);
            // Clear the reply form after posting
            const replyFormContainer = document.getElementById('replyFormContainer');
            replyFormContainer.innerHTML = '';
            // Fetch and update posts after posting a reply
            fetchPosts();
        }
</script>

<!-- Add a container for the reply form -->
<div id="replyFormContainer"></div>