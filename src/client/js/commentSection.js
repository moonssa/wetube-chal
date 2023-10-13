const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteComments = document.querySelectorAll("#deleteComment");

const handleDeleteComment = async (e) => {
  const li = e.target.parentElement;
  const commentId = e.target.parentElement.dataset.id;
  console.log(commentId);

  const response = await fetch(`/api/comment/${commentId}/delete`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    li.remove();
  }
};

const addComment = (text, newCommentId) => {
  const videoComment = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = newCommentId;

  const icon = document.createElement("i");
  const span = document.createElement("span");
  const deleteCommentBtn = document.createElement("button");

  span.innerText = ` ${text}`;
  icon.className = "fas fa-comment";
  deleteCommentBtn.innerText = `❌`;

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(deleteCommentBtn);
  videoComment.prepend(newComment);

  console.log("hahaha");
  console.log("deleteCommentBtn", deleteCommentBtn);
  deleteCommentBtn.addEventListener("click", handleDeleteComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  console.log("hahaha", videoContainer.dataset.id);
  let textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}
if (deleteComments) {
  deleteComments.forEach((comment) => {
    comment.addEventListener("click", handleDeleteComment);
  });
}
