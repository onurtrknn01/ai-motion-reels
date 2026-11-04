
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export type MotionScene = {
  type: string;
  duration: number;
  text: string;
  voiceover?: string;
  camera?: string;
  animation?: string;
};

export type MotionEngineProps = {
  titleText?: string;
  scenes?: MotionScene[];
};

export const MotionEngine: React.FC<MotionEngineProps> = ({
  titleText = "AI Motion Graphics",
  scenes = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const durations = scenes.map((scene) =>
    Math.max(1, Math.round(scene.duration * fps))
  );

  let startFrame = 0;
  let activeScene: MotionScene | undefined;

  for (let i = 0; i < scenes.length; i++) {
    if (frame < startFrame + durations[i]) {
      activeScene = scenes[i];
      break;
    }
    startFrame += durations[i];
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#071322",
        color: "#FFFFFF",
        fontFamily: "Arial, sans-serif",
        justifyContent: "center",
        alignItems: "center",
        padding: 70,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 38, color: "#52D9FF" }}>
        {titleText}
      </div>

      <div
        style={{
          fontSize: 68,
          fontWeight: 800,
          marginTop: 45,
        }}
      >
        {activeScene?.text ?? "Motion Graphics"}
      </div>
    </AbsoluteFill>
  );
};
