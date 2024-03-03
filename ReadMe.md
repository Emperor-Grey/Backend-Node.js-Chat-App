# Chat Application Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Dependencies](#dependencies)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Running the Application](#running-the-application)
5. [Usage](#usage)
   - [Socket Events](#socket-events)
   - [Messages](#messages)
   - [Location Sharing](#location-sharing)
6. [User Management](#user-management)
   - [Adding Users](#adding-users)
   - [Removing Users](#removing-users)
   - [Retrieving Users](#retrieving-users)
7. [Acknowledgments](#acknowledgments)

## 1. Introduction

The Chat Application is a real-time chat system built using Node.js, Express, and Socket.io. It allows users to join different chat rooms, send messages, and share their locations.

## 2. Dependencies

- Express
- Socket.io
- Bad-Words

## 3. Project Structure

The project consists of two main components:

1. **Server-Side (index.js):**

   - Handles WebSocket connections using Socket.io.
   - Manages user interactions, messages, and room data.

2. **Utilities (utils/users.js):**
   - Contains functions for user management, including adding, removing, and retrieving users.

## 4. Getting Started

### 4.1 Installation

Clone the repository and install the required dependencies:

```bash
git clone <repository_url>
cd <project_directory>
npm install
```

### 4.2 Running the Application

Start the server:

```bash
npm start
```

By default, the server runs on `http://localhost:3000`. You can customize the port using the `PORT` environment variable.

## 5. Usage

### 5.1 Socket Events

The application uses the following socket events:

- **connection:** Handles new WebSocket connections.
- **join:** Allows users to join a specific chat room.
- **sendMessage:** Sends text messages to the chat room.
- **sendLocation:** Shares the user's location.
- **disconnect:** Handles user disconnections.

### 5.2 Messages

The application generates and broadcasts various messages, including welcome messages, user join notifications, user leave notifications, and user chat messages.

### 5.3 Location Sharing

Users can share their location, which is then transformed into a Google Maps link.

## 6. User Management

### 6.1 Adding Users

The `addUser` function in `utils/users.js` adds users to the system. It performs data validation and ensures unique usernames within a room.

### 6.2 Removing Users

The `removeUser` function in `utils/users.js` removes users based on their socket ID.

### 6.3 Retrieving Users

- **getUser:** Retrieves a user based on their socket ID.
- **getUsersInRoom:** Retrieves all users in a specific chat room.

## 7. Acknowledgments

- The project uses Express for the web server and Socket.io for real-time communication.
- Bad-Words is used to filter out profanity from user messages.

## 8. Messages Utilities (utils/messages.js)

The `utils/messages.js` module provides utility functions for generating different types of messages used in the chat application.

### 8.1 Functions

#### 8.1.1 `generateMessage(username, text)`

Generates a standard text message object with the following properties:

- `username`: The sender's username.
- `text`: The message content.
- `createdAt`: The timestamp when the message is created.

**Example:**

```javascript
const message = generateMessage('JohnDoe', 'Hello, chat world!');
console.log(message);
```

**Output:**

```json
{
  "username": "JohnDoe",
  "text": "Hello, chat world!",
  "createdAt": 1646304000000
}
```

## 9. HTML Documentation

### 9.1 Join Page (public/index.html)

The Join Page serves as the entry point for users to join the chat application. It contains a form where users can input their display name and the desired chat room.

- **Structure:**
  - `<h1>`: Displays the "Join" heading.
  - Form:
    - Input for the display name (`username`).
    - Input for the chat room (`room`).
    - "Join" button to submit the form.

### 9.2 Chat Page (public/chat.html)

The Chat Page is the main interface for users actively engaged in the chat. It consists of two main sections: the chat sidebar and the chat main area.

- **Structure:**

  - Chat Container:
    - `#sidebar`: A container for the chat sidebar, which displays room information and the list of users.
    - `#messages`: The chat messages area where messages are dynamically displayed.
    - Compose Section:
      - Form (`#messageForm`): Allows users to input and send text messages.
      - Input field for typing messages (`message`).
      - "Send" button to submit messages.
      - "Send Location" button to share location.
  - Message Templates:
    - `<script id="messageTemplate" type="text/html">`: Template for displaying text messages.
    - `<script id="locationMessageTemplate" type="text/html">`: Template for displaying location messages.
    - `<script id="sidebarTemplate" type="text/html">`: Template for displaying room information and the list of users.

- **External Libraries:**

  - Mustache.js: Used for templating.
  - Moment.js: Library for handling timestamps.
  - qs.js: Helps with parsing query strings.
  - Socket.io.js: The client-side Socket.io library for real-time communication.

- **Application Script:**
  - `./js/chat.js`: The application script responsible for handling client-side logic, interacting with the server, and updating the UI based on received messages.

## 10. Chat.js Documentation

The `chat.js` file handles the client-side logic for the chat application. It utilizes Socket.io for real-time communication and Mustache.js for rendering message templates.

### 10.1 Setup and Initialization

```javascript
const socket = io(); // Initializes Socket.io connection.
```

### 10.2 DOM Elements

```javascript
// Elements
const $messageForm = document.querySelector('#messageForm');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $userLocation = document.querySelector('#sendLocation');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');
```

These variables represent key elements on the chat page, facilitating interactions and updates.

### 10.3 Mustache.js Templates

```javascript
// Templates
const messageTemplates = document.querySelector('#messageTemplate').innerHTML;
const locationMessageTemplate = document.querySelector(
  '#locationMessageTemplate'
).innerHTML;
const sidebarTemplate = document.querySelector('#sidebarTemplate').innerHTML;
```

These variables store Mustache.js templates for rendering different types of messages and the sidebar.

### 10.4 URL Parsing

```javascript
// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
```

The `Qs` library parses the query parameters from the URL, extracting the `username` and `room` values.

### 10.5 Auto-Scroll Function

```javascript
const autoScroll = () => {
  // Function to auto-scroll the chat messages to the latest.
};
```

This function ensures that the chat messages automatically scroll to the latest message as new messages are added.

### 10.6 Socket.io Event Listeners

- **`message` Event:**

  - Renders and displays text messages in the chat area.

- **`locationMessage` Event:**

  - Renders and displays location messages in the chat area.

- **`sendMessage` Event:**

  - Handles form submission to send text messages to the server.

- **`sendLocation` Event:**

  - Handles button click to share the user's location.

- **`join` Event:**

  - Sends information about the user joining the chat room.

- **`roomData` Event:**
  - Renders and updates the sidebar with room information and user list.

### 10.7 Socket.io Event Emitters

- **`emit("sendMessage", message, callback)` Event:**

  - Emits the `sendMessage` event to the server with the user's message.

- **`emit("sendLocation", { latitude, longitude }, callback)` Event:**

  - Emits the `sendLocation` event to the server with the user's location.

- **`emit("join", { username, room }, callback)` Event:**
  - Emits the `join` event to the server when a user joins the chat room.

### 10.8 UI Updates

The file manages UI updates by rendering messages and updating the sidebar when specific Socket.io events occur.
