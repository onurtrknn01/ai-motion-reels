
import React from "react";
import {
  AbsoluteFill,
  Img,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type MotionScene = {
  type: string;
  duration: number;
  text: string;
  voiceover?: string;
  camera?: string;
  animation?: string;
  visualPrompt?: string;
  imageUrl?: string;
  textAnimation?: string;
  soundEffects?: string[];
  transition?: string;
};

export type MotionEngineProps = {
  titleText?: string;
  scenes?: MotionScene[];
};

const COLORS = {
  background: "#071322",
  cyan: "#52D9FF",
  blue: "#008BD2",
  white: "#FFFFFF",
  orange: "#FFAE52",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const getCameraTransform = (
  frame: number,
  durationFrames: number,
  camera?: string
) => {
  const progress = interpolate(
    frame,
    [0, Math.max(1, durationFrames - 1)],
    [0, 1],
    clamp
  );

  const mode = (camera ?? "").toLowerCase();

  if (mode.includes("zoom_out")) {
    return `scale(${1.15 - progress * 0.15})`;
  }

  if (mode.includes("pan_left")) {
    return `translateX(${-80 * progress}px) scale(1.12)`;
  }

  if (mode.includes("pan_right")) {
    return `translateX(${80 * progress}px) scale(1.12)`;
  }

  if (mode.includes("tilt")) {
    return `translateY(${-60 * progress}px) scale(1.1)`;
  }

  return `scale(${1 + progress * 0.12})`;
};

const AnimatedTitle: React.FC<{
  text: string;
  frame: number;
  durationFrames: number;
  animation?: string;
}> = ({ text, frame, durationFrames, animation }) => {
  const entry = interpolate(frame, [0, 20], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  const exit = interpolate(
    frame,
    [Math.max(0, durationFrames - 12), durationFrames],
    [1, 0],
    clamp
  );

  const mode = (animation ?? "").toLowerCase();
  const translateX = mode.includes("slide_left")
    ? (1 - entry) * 150
    : mode.includes("slide_right")
      ? (entry - 1) * 150
      : 0;

  const translateY = mode.includes("slide_up")
    ? (1 - entry) * 130
    : (1 - entry) * 65;

  const scale = mode.includes("scale")
    ? 0.75 + entry * 0.25
    : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: 65,
        right: 65,
        top: 190,
        zIndex: 5,
        textAlign: "center",
        color: COLORS.white,
        fontFamily: "Arial, sans-serif",
        fontSize: 70,
        fontWeight: 900,
        lineHeight: 1.12,
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
        textShadow: "0 6px 25px rgba(0,0,0,0.8)",
        opacity: entry * exit,
        transform:
          `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      }}
    >
      {text}
    </div>
  );
};

const AnimatedBars: React.FC<{ frame: number }> = ({ frame }) => {
  const values = [0.45, 0.78, 0.62, 0.95];

  return (
    <div
      style={{
        position: "absolute",
        left: 125,
        right: 125,
        bottom: 330,
        height: 470,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 30,
      }}
    >
      {values.map((value, index) => {
        const progress = interpolate(
          frame,
          [index * 8, index * 8 + 35],
          [0, 1],
          {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          }
        );

        return (
          <div
            key={index}
            style={{
              flex: 1,
              height: `${value * progress * 100}%`,
              borderRadius: "16px 16px 0 0",
              background:
                index === 3
                  ? COLORS.orange
                  : `linear-gradient(180deg, ${COLORS.cyan}, ${COLORS.blue})`,
              boxShadow: "0 0 35px rgba(82,217,255,0.3)",
            }}
          />
        );
      })}
    </div>
  );
};

const AnimatedCounter: React.FC<{ frame: number }> = ({
  frame,
}) => {
  const value = Math.round(
    interpolate(frame, [0, 65], [0, 100], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    })
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 780,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 210,
        fontWeight: 900,
        color: COLORS.cyan,
        fontFamily: "Arial, sans-serif",
        textShadow: "0 0 55px rgba(82,217,255,0.45)",
      }}
    >
      {value}%
    </div>
  );
};

const ComparisonGraphic: React.FC<{ frame: number }> = ({
  frame,
}) => {
  const progress = interpolate(frame, [0, 35], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 760,
        left: 65,
        right: 65,
        display: "flex",
        gap: 25,
      }}
    >
      {[COLORS.blue, COLORS.orange].map((color, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            height: 370,
            borderRadius: 28,
            background: `${color}35`,
            border: `3px solid ${color}`,
            transform: `translateY(${(1 - progress) * (index ? 110 : -110)}px)`,
            opacity: progress,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 95,
            fontWeight: 900,
            color: COLORS.white,
          }}
        >
          {index === 0 ? "A" : "B"}
        </div>
      ))}
    </div>
  );
};

const SceneView: React.FC<{
  scene: MotionScene;
  localFrame: number;
  durationFrames: number;
}> = ({ scene, localFrame, durationFrames }) => {
  const type = scene.type.toLowerCase();

  const imageSource =
    scene.imageUrl ||
    (type === "product_reveal"
      ? staticFile("heatpump-scene.png")
      : undefined);

  const graphicOpacity = interpolate(
    localFrame,
    [10, 35],
    [0, 1],
    clamp
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {imageSource ? (
        <AbsoluteFill
          style={{
            transform: getCameraTransform(
              localFrame,
              durationFrames,
              scene.camera
            ),
          }}
        >
          <Img
            src={imageSource}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 55%, #123E63, #071322 75%)",
          }}
        />
      )}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(3,12,28,0.78), rgba(3,12,28,0.1) 45%, rgba(3,12,28,0.8))",
        }}
      />

      {type === "animated_bar_chart" && (
        <AnimatedBars frame={localFrame} />
      )}

      {type === "animated_counter" && (
        <AnimatedCounter frame={localFrame} />
      )}

      {type === "comparison" && (
        <ComparisonGraphic frame={localFrame} />
      )}

      {type === "icon_animation" && (
        <div
          style={{
            position: "absolute",
            top: 800,
            left: 390,
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: `12px solid ${COLORS.cyan}`,
            boxShadow: "0 0 80px rgba(82,217,255,0.5)",
            opacity: graphicOpacity,
            transform: `scale(${interpolate(
              localFrame,
              [0, 35],
              [0.4, 1],
              clamp
            )})`,
          }}
        />
      )}

      <AnimatedTitle
        text={scene.text}
        frame={localFrame}
        durationFrames={durationFrames}
        animation={scene.textAnimation || scene.animation}
      />

      {type === "final_cta" && (
        <div
          style={{
            position: "absolute",
            bottom: 270,
            left: 150,
            right: 150,
            padding: 32,
            borderRadius: 25,
            background: COLORS.blue,
            color: COLORS.white,
            fontSize: 42,
            fontWeight: 800,
            textAlign: "center",
            opacity: graphicOpacity,
            transform: `scale(${0.85 + graphicOpacity * 0.15})`,
          }}
        >
          DETAYLI BİLGİ AL
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 75,
          right: 75,
          height: 5,
          borderRadius: 10,
          background: "rgba(255,255,255,0.2)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${interpolate(
              localFrame,
              [0, Math.max(1, durationFrames - 1)],
              [0, 100],
              clamp
            )}%`,
            background: COLORS.cyan,
            borderRadius: 10,
          }}
        />
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

  let startFrame = 0;

  for (const scene of scenes) {
    const durationFrames = Math.max(
      1,
      Math.round(scene.duration * fps)
    );

    if (frame < startFrame + durationFrames) {
      return (
        <SceneView
          scene={scene}
          localFrame={frame - startFrame}
          durationFrames={durationFrames}
        />
      );
    }

    startFrame += durationFrames;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        color: COLORS.white,
        fontFamily: "Arial, sans-serif",
        fontSize: 64,
        fontWeight: 900,
        textAlign: "center",
        padding: 70,
      }}
    >
      {titleText}
    </AbsoluteFill>
  );
};
