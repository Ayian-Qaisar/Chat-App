const socket = io();
const loginForm = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username-input");
const chatForm = document.querySelector("#chat-form");
const toInput = document.querySelector("#to-input");
const messageInput = document.querySelector("#message-input");
const messages = document.querySelector("#messages");
const loginButton = document.querySelector("#login-button");
const sendButton = document.querySelector("#send-button");
const numUsers = document.querySelector("#num-users"); // new element to display number of users
console.log(numUsers);

let currentUser = null;

loginButton.addEventListener("click", () => {
  const username = usernameInput.value;
  if (username) {
    socket.emit("login", username);
    currentUser = username;
    loginForm.style.display = "none";
    chatForm.style.display = "block";
  }
});

sendButton.addEventListener("click", () => {
  const to = toInput.value;
  const message = messageInput.value;
  if (to && message) {
    socket.emit("private message", { from: currentUser, to, message });
    const li = document.createElement("li");
    li.textContent = `[${currentUser} to ${to}]: ${message}`;
    messages.appendChild(li);
    messageInput.value = "";
  }
});

socket.on("private message", ({ from, message }) => {
  const li = document.createElement("li");
  li.textContent = `[${from}]: ${message}`;
  messages.appendChild(li);
});

// update the number of users on the client-side when the number of users changes
socket.on("num users", (numUsers) => {
  numUsers.innerText = `Number of users logged in: ${numUsers}`;
  console.log(numUsers.innerHTML);
});
