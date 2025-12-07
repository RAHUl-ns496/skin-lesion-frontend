import Webcam from "react-webcam";
import { useRef } from "react";

export default function CameraCapture({ setImage }) {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "camera.jpg", { type: "image/jpeg" });
        setImage(file);
      });
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="300"
      />
      <button onClick={capture}>📸 Capture</button>
    </div>
  );
}
