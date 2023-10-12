const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const addComment = (text) => {
  const videoComment = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const icon = document.createElement("i");
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  icon.className = "fas fa-comment";
  newComment.className = "video__comment";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  videoComment.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  console.log(videoContainer.dataset.id);
  let textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  textarea.value = "";
  if (status === 201) {
    addComment(text);
  }
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}
