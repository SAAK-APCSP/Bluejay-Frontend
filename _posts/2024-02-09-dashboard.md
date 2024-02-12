---
comments: True
layout: post
toc: false
title: Dashboard
permalink: /dashboard
type: hacks
courses: { "compsci": { "week": 2 } }
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Form</title>
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
    </style>
</head>
<body>
    <div class="login-container">
        <label for="uname"><b>Username</b></label>
        <input type="text" placeholder="Enter Username" name="uname" required>

        <label for="psw"><b>Password</b></label>
        <input type="password" placeholder="Enter Password" name="psw" required>

        <button type="submit">Login</button>

        <span class="psw">Forgot <a href="#">password?</a></span>
    </div>
</body>
</html>
