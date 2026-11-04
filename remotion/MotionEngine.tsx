
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

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

const HeatPumpIntro: React.FC<{ localFrame: number }> = ({
  localFrame,
}) => {
  const zoom = interpolate(localFrame, [0, 210], [1, 1.16], {
    extrapolateRight: "clamp",
  });

  const pan = interpolate(localFrame, [0, 210], [0, -65], {
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(localFrame, [0, 22], [-120, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const titleOpacity = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translateY(${pan}px) scale(${zoom})`,
        transformOrigin: "50% 65%",
        overflow: "hidden",
      }}
      >
        <Img
          src={staticFile("heatpump-scene.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(3,12,28,0.65) 0%, transparent 32%, transparent 75%, rgba(3,12,28,0.6) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 145,
          left: 65,
          right: 65,
          textAlign: "center",
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          fontFamily: "Arial, sans-serif",
          fontSize: 72,
          fontWeight: 900,
          color: "#FFFFFF",
          textShadow: "0 5px 25px rgba(0,0,0,0.65)",
        }}
      >
        ISI POMPASI
        <div style={{ color: "#65E3FF", fontSize: 59 }}>
          NASIL ÇALIŞIR?
        </div>
      </div>

      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        {Array.from({ length: 13 }).map((_, i) => {
          const progress = ((localFrame * 0.012 + i / 13) % 1);
          const x = interpolate(progress, [0, 1], [0, 450]);
          const y = 1100 - Math.sin(progress * Math.PI) * 75 + i * 6;

          return (
            <circle
              key={`cold-${i}`}
              cx={x}
              cy={y}
              r={5 + i % 3}
              fill="#56DFFF"
              opacity={Math.sin(progress * Math.PI) * 0.85}
            />
          );
        })}

        {Array.from({ length: 13 }).map((_, i) => {
          const progress = ((localFrame * 0.012 + i / 13) % 1);
          const x = interpolate(progress, [0, 1], [520, 1050]);
          const y = 1190 - Math.sin(progress * Math.PI) * 85 + i * 5;

          return (
            <circle
              key={`warm-${i}`}
              cx={x}
              cy={y}
              r={5 + i % 3}
              fill="#FF9D37"
              opacity={Math.sin(progress * Math.PI) * 0.9}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          bottom: 125,
          left: 65,
          right: 65,
          padding: "24px 32px",
          borderRadius: 25,
          background: "rgba(3,16,34,0.78)",
          border: "2px solid rgba(100,220,255,0.45)",
          color: "white",
          fontFamily: "Arial, sans-serif",
          fontSize: 38,
          fontWeight: 700,
          textAlign: "center",
          opacity: interpolate(localFrame, [55, 80], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Dış havadaki enerjiyi evinizin ısısına dönüştürür.
      </div>
    </AbsoluteFill>
  );
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

  const localFrame = frame - startFrame;

  if (activeScene?.type === "product_reveal") {
    return <HeatPumpIntro localFrame={localFrame} />;
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
          opacity: interpolate(
            localFrame,
            [0, 15],
            [0, 1],
            { extrapolateRight: "clamp" }
          ),
        }}
      >
        {activeScene?.text ?? "Motion Graphics"}
      </div>
    </AbsoluteFill>
  );
};
