const socket = io();

// Elements
const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("button");
const $userLocation = document.querySelector("#sendLocation");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplates = document.querySelector("#messageTemplate").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#locationMessageTemplate",
).innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("message", (message) => {
  console.log(message);

  const html = Mustache.render(messageTemplates, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });

  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (url) => {
  console.log(url);

  const html = Mustache.render(locationMessageTemplate, {
    url: url.url,
    createdAt: moment(url.createdAt).format("h:mm a"),
  });

  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // disable a form
  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (err) => {
    // re-enable the form
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (err) {
      return console.log(err);
    }

    console.log("Message Delivered");
  });
});

$userLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }

  // disable the Location
  $userLocation.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        // reEnabling the location button
        $userLocation.removeAttribute("disabled");
        console.log("Location shared");
      },
    );
  });
});

socket.emit("join", { username, room });
