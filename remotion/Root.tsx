
import {Composition} from "remotion";
import {HelloWorld, helloWorldCompSchema} from "./HelloWorld";
import {HeatPump} from "./HeatPump";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={800}
        fps={30}
        width={1920}
        height={1080}
        schema={helloWorldCompSchema}
        defaultProps={{
          titleText: "Render Server Template",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      <Composition
        id="HeatPump"
        component={HeatPump}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
