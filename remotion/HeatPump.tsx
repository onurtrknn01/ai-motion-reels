import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const HeatPump: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const zoom = interpolate(frame, [0, 90, 240], [0.78, 1, 0.88], {
    extrapolateRight: "clamp",
  });

  const fade = interpolate(frame, [0, 20, 240, 265], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const flow = (frame * 8) % 180;

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 40%, #17384a, #061018 75%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill style={{opacity: fade}}>
        <div
          style={{
            position: "absolute",
            top: 160,
            width: "100%",
            textAlign: "center",
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          HAVADAKİ ENERJİ
        </div>
        <div
          style={{
            position: "absolute",
            top: 250,
            width: "100%",
            textAlign: "center",
            fontSize: 40,
            color: "#58d8ff",
          }}
        >
          EVİNİZDE SICAKLIĞA DÖNÜŞÜR
        </div>

        <div
          style={{
            position: "absolute",
            top: 400,
            left: 80,
            width: 920,
            height: 700,
            transform: `scale(${zoom}) translateX(${Math.sin(t * 0.5) * 12}px)`,
          }}
        >
          <Img
            src={staticFile("ısı pompası.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 35px 45px #0009)",
            }}
          />
        </div>

        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{position: "absolute", inset: 0, pointerEvents: "none"}}
        >
          {Array.from({length: 7}, (_, i) => {
            const y = 690 + i * 45;
            return (
              <path
                key={i}
                d={`M -100 ${y} C 100 ${y - 60}, 190 ${y + 35}, 340 ${y}`}
                fill="none"
                stroke="#52d9ff"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="55 125"
                strokeDashoffset={-flow - i * 25}
                opacity={0.55 + Math.sin(t * 2 + i) * 0.2}
              />
            );
          })}
        </svg>

        <div
          style={{
            position: "absolute",
            top: 1130,
            left: 80,
            width: 920,
            height: 330,
            border: "2px solid #ffffff30",
            borderRadius: 28,
            background: "#071822dd",
            padding: 36,
            boxSizing: "border-box",
          }}
        >
          <div style={{fontSize: 38, color: "#64d9ff", fontWeight: 700}}>
            DIŞ ORTAMDAN ENERJİ ALINIR
          </div>

          <svg width="840" height="125" viewBox="0 0 840 125">
            <path
              d="M 20 62 H 820"
              stroke="#26404d"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M 20 62 H 820"
              stroke="#ff873a"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="45 35"
              strokeDashoffset={-frame * 5}
            />
            <text x="12" y="115" fill="white" fontSize="23">
              ISI POMPASI
            </text>
            <text x="620" y="115" fill="white" fontSize="23">
              PETEK SİSTEMİ
            </text>
          </svg>

          <div style={{fontSize: 30, lineHeight: 1.4}}>
            Isı enerjisi, sıcak su aracılığıyla
            radyatörlere taşınır.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 150,
            width: "100%",
            textAlign: "center",
            fontSize: 50,
            fontWeight: 800,
          }}
        >
          KOZLUSAN <span style={{color: "#ff873a"}}>HP HEAT</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
