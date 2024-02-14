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
    
        <!-- 
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
    </style> -->
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
