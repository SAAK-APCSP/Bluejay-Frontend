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
            <input type="text" id="uid" placeholder="Enter UID...">
            <textarea id="message" placeholder="Type your post..."></textarea>
            <button id="postButton">Post</button>
        </div>
        <div class="posts-container">
            <h2>Posts</h2>
            <div id="posts"></div>
        </div>
    </div>
    <div id="latestPosts" class="latest-posts"></div>
    <script type="module">
        import { uri, options } from '{{site.baseurl}}/config.js';
        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById("postButton").addEventListener("click", createPost);
            // console.log(location.hostname);
            function createPost() {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                const uri = '{{site.baseurl}}';
                const body = {
                    uid: document.getElementById("uid").value,
                    message: document.getElementById("message").value
                };
                const authOptions = {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: myHeaders,
                    body: JSON.stringify(body),
                    credentials: 'include'
                };
                let error_Msg = ''; // Declare error_Msg outside of any block
                fetch(uri + '/api/messages/send', authOptions)
                    .then(response => {
                        if (response.status == 400) {
                            error_Msg = 'This account does not exist.'; // Assign value to error_Msg
                            alert(error_Msg); // Display error message
                            return null;
                        }
                        if (!response.ok) {
                            error_Msg = 'Login error: ' + response.status;
                            alert(error_Msg); // Display error message
                            console.log(error_Msg);
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
                            // console.log(document.cookie);
                            // window.location.href = "{{site.baseurl}}/2024/02/12/table.html";
                        }
                        // window.location.href = "{{site.baseurl}}/";
                    });
            }
        });
    </script>
</body>
</html>
