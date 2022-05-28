import { ILocalVideoTrack, IRemoteVideoTrack, ILocalAudioTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import React, { useRef, useEffect } from "react";

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
}

const MediaPlayer = (props: VideoPlayerProps) => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current || props.videoTrack == undefined) return;
        props.videoTrack.play(container.current);
    return () => {
      //props.videoTrack.stop();
    };
  }, [container, props.videoTrack]);
  useEffect(() => {
      if ( props.audioTrack == undefined) return;
    props.audioTrack.play();
    return () => {
     // props.audioTrack.stop();
    };
  }, [props.audioTrack]);
  return (
    <div ref={container}  className="video-player" style={{ width: "75%", height: "100%"}}></div>
  );
}

export default MediaPlayer;