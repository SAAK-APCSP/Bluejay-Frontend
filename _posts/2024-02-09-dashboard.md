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
        postDiv.dataset.uid = uid; // Assigning uid as a dataset attribute
        const postContent = document.createElement('p');
        postContent.className = 'post-content';
        postContent.textContent = `UID: ${uid}, Message: ${message}`;
        const replyButton = document.createElement('button');
        replyButton.textContent = 'Reply';
        replyButton.addEventListener('click', () => showReplyForm(uid));
        const editButton = document.createElement('button'); // Edit button
        editButton.textContent = 'Edit'; // Set text content to 'Edit'
        editButton.addEventListener('click', () => showEditForm(uid, message)); // Call showEditForm function
        const likeButton = document.createElement('button'); // Like button
        likeButton.textContent = 'Like';
        likeButton.addEventListener('click', () => {
            likePost(uid, message);
            // Hide the like button after clicking
            likeButton.style.display = 'none';
        });
        const likeCountContainer = document.createElement('div'); // Create container for like count
        likeCountContainer.className = 'like-count-container'; // Assign a class to the container
        const likesCountSpan = document.createElement('span'); // Create the likes count span
        likesCountSpan.className = 'likes-count'; // Assign the likes-count class
        likesCountSpan.textContent = `${likes} 👍`; // Display likes count
        likeCountContainer.appendChild(likesCountSpan); // Append likes count span to container
        postDiv.appendChild(postContent);
        postDiv.appendChild(replyButton);
        postDiv.appendChild(editButton); // Append the edit button
        postDiv.appendChild(likeButton);
        postDiv.appendChild(likeCountContainer); // Append like count container
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
        var currentLikes = 0;
        if (likesCountSpan) {
            currentLikes = parseInt(likesCountSpan.textContent, 10) || 0;
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
                    if (likesCountSpan) {
                        likesCountSpan.textContent = `${currentLikes + 1} 👍`;
                    }
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
    function showEditForm(uid, message) {
        const editFormContainer = document.getElementById('editFormContainer');
        editFormContainer.innerHTML = ''; // Clear existing content
        const editForm = document.createElement('form');
        editForm.className = 'edit-form-container';
        editForm.innerHTML = `
            <h3>Edit Message with UID: ${uid}</h3>
            <textarea id="editMessage" placeholder="Edit your message...">${message}</textarea>
            <button type="button" onclick="editPost('${uid}')">Save Changes</button>
        `;
        editFormContainer.appendChild(editForm);
    }
    function editPost(uid) {
        const editedMessage = document.getElementById('editMessage').value;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const body = {
            // uid: uid,
            message: editedMessage,
        };
        console.log(body);
        const authOptions = {
            method: 'DELETE', // Change method to POST
            // mode: 'cors',
            cache: 'no-cache',
            headers: myHeaders,
            body: JSON.stringify(body),
            credentials: 'include'
        };
        fetch('http://127.0.0.1:8086/api/messages/delete', authOptions)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to edit post:', response.status);
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
                    console.log('Edit Response:', data);
                    // Clear the edit form after editing
                    const editFormContainer = document.getElementById('editFormContainer');
                    editFormContainer.innerHTML = '';
                    // Fetch and update posts after editing a message
                    fetchPosts(); // Call the fetchPosts function to update the posts
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
</script>


<!-- Add a container for the reply form -->
<div id="replyFormContainer"></div>

<!-- Add a container for the edit form -->
<div id="editFormContainer"></div>
