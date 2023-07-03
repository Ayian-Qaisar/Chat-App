var signInData = JSON.parse(localStorage.getItem("signInData")) || [];
var personlc = localStorage.getItem("person");
var emaillc = localStorage.getItem("email");

// console.log(signInData);
console.log(signInData[0].email);
console.log(signInData[0].bday);

let chatPage = document.querySelector("#chat-page");
let loginPage = document.querySelector("#login-page");
let submitBtn = document.querySelector(".submitBtn");
let joinRoomBtn = document.querySelector("#joinRoomBtn");

const socket = io();
let newName1 = document.querySelector("#newName1");
let newRoomNo = document.querySelector("#newRoomNo");

let newName2 = document.querySelector("#newName2");
let newRoomNo2 = document.querySelector("#newRoomNo2");

let newName3 = document.querySelector("#newName3");
let phone1 = document.querySelector("#phone1");

newName1.innerHTML = personlc.toUpperCase();
// newRoomNo.innerHTML += roomInput;

newName2.innerHTML = personlc.toUpperCase();
// newRoomNo2.innerHTML += roomInput;

newName3.innerHTML = signInData[0].email;
phone1.innerHTML = signInData[0].bday;

submitBtn.addEventListener("click", function () {
  const roomInput = document.querySelector("#roomNo").value.trim();

  let usernameInput = personlc;
  newRoomNo.innerHTML += roomInput;
  newRoomNo2.innerHTML += roomInput;

  username = usernameInput;
  room = roomInput;

  socket.emit("newuser", { username, room });

  chatPage.style.display = "block";
  loginPage.style.display = "none";
});

document.querySelector("#send-message").addEventListener("click", function () {
  console.log("working");
  const messageInput = document.querySelector("#message-input").value.trim();
  if (messageInput.length === 0) {
    return;
  }

  socket.emit("chat", { username, room, text: messageInput });

  renderMessage("my", {
    username: "You",
    text: messageInput,
  });

  document.querySelector("#message-input").value = "";
});

document.querySelector("#exit-chat").addEventListener("click", function () {
  // socket.emit("exituser");
  // window.location.href = "index.html";
  localStorage.removeItem("person");
});

document.querySelector("#joinRoomBtn").addEventListener("click", function () {
  socket.emit("exituser");
  location.reload();
});

document.querySelector("#dropLogout").addEventListener("click", function () {
  // socket.emit("exituser");
  // location.reload();
  // window.location.href = "index.html";
  localStorage.removeItem("person");
});

socket.on("chat", function (message) {
  const username = message.username;
  // console.log(username);
  const text = message.text;
  console.log(message.text.text);
  const roomName = message.roomName;
  renderMessage("other", { username, text });
  // if (roomName === room) {
  // }
});

socket.on("update", function (update) {
  renderMessage("update", update);
});

socket.on("chatHistory", function (history) {
  history.forEach((message) => {
    const roomName = message.roomName;
    if (roomName === room) {
      renderMessage("old", message);
    }
  });
});

function renderMessage(type, message) {
  let messageContainer = document.querySelector("#chat-screen");
  //   console.log(messageContainer);

  // console.log(message.username);
  if (type === "my") {
    let el = document.createElement("div");
    el.setAttribute("class", "message my-message");
    el.innerHTML = `
    <div>
            <p class="name">You</p>
            <p class="mb-1">${message.text}</p>
          </div>
        `;
    messageContainer.append(el);
  } else if (type === "other") {
    let el = document.createElement("div");
    el.setAttribute("class", "message other-message");
    el.innerHTML = `
          <div>
            <p class="name">${message.username}</p>
            <p class="mb-1">${message.text.text}</p>
          </div>
        `;
    messageContainer.append(el);
  } else if (type === "old") {
    let el = document.createElement("div");
    el.setAttribute("class", "message old-message");
    el.innerHTML = `
          <div>
            <p class="name">${message.username}</p>
            <p class="mb-1">${message.text}</p>
          </div>
        `;
    messageContainer.prepend(el);
  } else if (type === "update") {
    let el = document.createElement("div");
    el.setAttribute("class", "update");
    el.innerText = message;
    messageContainer.append(el);
  }

  // scroll chat to end

  messageContainer.scrollTop =
    messageContainer.scrollHeight - messageContainer.clientHeight;
}
