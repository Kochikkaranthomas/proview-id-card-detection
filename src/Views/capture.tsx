import React, { useState, useEffect, useRef } from "react";

const useMediaDevices = (
  mediaOptions: MediaStreamConstraints
): [MediaStream | undefined, string | null] => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [mediaError, setMediaError] = useState<string | null>(null);
  async function detectMedia() {
    let stream: React.SetStateAction<MediaStream | undefined>;
    try {
      stream = await navigator.mediaDevices.getUserMedia(mediaOptions);
      setMediaStream(stream);
    } catch (e: any) {
      setMediaError(e.message);
    }
    return () => {
      setMediaStream(stream);
    };
  }

  React.useEffect(() => {
    detectMedia();
  }, []);

  return [mediaStream, mediaError];
};
type VideoPlayerProps = {
  mediaStream?: MediaStream;
  playerWidth: string;
  videoRef: React.RefObject<HTMLVideoElement>;
};
const VideoPlayer = (props: VideoPlayerProps) => {
  useEffect(() => {
    if (
      props.mediaStream &&
      props.videoRef?.current &&
      !props.videoRef.current.srcObject
    ) {
      props.videoRef.current.srcObject = props.mediaStream;
    }
  }, [props.mediaStream, props.videoRef]);

  return (
    <>
      <video
        style={{ width: `${props.playerWidth}` }}
        role="video"
        ref={props.videoRef}
        muted
        autoPlay
      ></video>
    </>
  );
};

type Props = {
  height: number;
  width: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

const Canvas: React.FC<Props> = (props) => {
  React.useEffect(() => {
    if (props.canvasRef.current) {
      const context = props.canvasRef.current.getContext("2d");
      if (context && props.videoRef.current) {
        context.drawImage(
          props.videoRef.current,
          0,
          0,
          props.width,
          props.height
        );
      }
    }
  });

  return (
    <canvas
      className="photoIdCanvas"
      ref={props.canvasRef}
      height={props.height}
      width={props.width}
    />
  );
};

const Capture = () => {
  const [mediaStream] = useMediaDevices({
    audio: false,
    video: { width: 640, height: 280 },
  });

  const [captured, setCaptured] = useState(false);
  const [cropped, setCropped] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoRef1 = React.useRef<HTMLVideoElement>(null);
  const fileSelectRef = React.useRef<HTMLInputElement>(null);

  const onCapture = () => {
    setCaptured(true);
    if (fileSelectRef && fileSelectRef.current) {
      fileSelectRef.current.value = "";
    }
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL();
      console.log(dataURL);
    }
  };
  
  const handleCrop = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const x = 450;
        const y = 180;
        const width = 300;
        const height = 180;
        const croppedCanvas = document.createElement("canvas");
        const croppedCtx = croppedCanvas.getContext("2d");
        if (croppedCtx) {
          croppedCanvas.width = width;
          croppedCanvas.height = height;
          croppedCtx.drawImage(
            canvasRef.current,
            x,
            y,
            width,
            height,
            0,
            0,
            width,
            height
          );
          const croppedImage = new Image();
          croppedImage.src = croppedCanvas.toDataURL();
          document.body.appendChild(croppedImage); // Just for demonstration
          setCropped(true);
        }
      }
    }
  };
  return (
    <div className="innerContent">
      <div className="h-inh">
        <div className="h-inh">
          {mediaStream && (
            <>
              <div className="photIdVideoPlayerWrapper h-inh">
                {!cropped && (
                  <div className="crpArea2">
                    <VideoPlayer
                      videoRef={videoRef1}
                      mediaStream={mediaStream}
                      playerWidth={"100%"}
                    />
                  </div>
                )}
                {mediaStream && (
                  <div
                    className={
                      captured
                        ? "dis-n pos-r 1234"
                        : "w-full pos-r h-inh flex-col 2345"
                    }
                  >
                    <VideoPlayer
                      videoRef={videoRef}
                      mediaStream={mediaStream}
                      playerWidth={"100%"}
                    />
                    <button className="capBtn" onClick={onCapture}>
                      capture
                    </button>
                    <div className="crpArea"></div>
                  </div>
                )}

                <div
                  className={
                    !captured
                      ? "dis-n pos-r 3456"
                      : "w-full pos-r h-inh flex-col 4567"
                  }
                >
                  {!cropped && (
                    <>
                      <Canvas
                        videoRef={videoRef}
                        canvasRef={canvasRef}
                        height={280}
                        width={640}
                      />
                      <button className="capBtn" onClick={handleCrop}>
                        Crop
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Capture;
