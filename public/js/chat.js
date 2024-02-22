const socket = io();

// Elements
const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("button");
const $userLocation = document.querySelector("#sendLocation");

socket.on("message", (message) => {
  console.log(message);
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
