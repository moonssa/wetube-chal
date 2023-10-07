const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");
let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  startBtn.removeEventListener("click", handleDownload);
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyFinalRecording.mp4";
  document.body.appendChild(a);
  a.click();
};
const handleStop = () => {
  startBtn.innerText = "Download recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};
const handleStart = () => {
  startBtn.innerText = "Stop recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (e) => {
    console.log(e.data);
    videoFile = URL.createObjectURL(e.data);
    console.log(videoFile);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
  // setTimeout(() => {
  //   recorder.stop();
  // }, 10000);
};

//preview
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
