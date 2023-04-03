import { OrbitControls, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Color, Group } from "three";
import { updatePoses } from "../lib/updatePoses";

type Keyframe = {
  keypoints: number[];
  keypoints3D: number[];
  handedness: "Right" | "Left";
  score: number;
};

export default function LineHands() {
  const groupRef = useRef<Group>(null);
  const handmotion = useRef<Keyframe[]>();
  const keyframes = useRef<number[][]>([]);
  const points = useRef<number[][]>([]);

  const thumb = useRef(null);
  const index = useRef(null);
  const middle = useRef(null);
  const ring = useRef(null);
  const pinky = useRef(null);

  const fin0 = useRef(null);
  const fin1 = useRef(null);
  const fin2 = useRef(null);
  const fin3 = useRef(null);
  const fin4 = useRef(null);
  const fin5 = useRef(null);
  const fin6 = useRef(null);
  const fin7 = useRef(null);
  const fin8 = useRef(null);
  const fin9 = useRef(null);
  const fin10 = useRef(null);

  const speed = 0.1; //0.1ずつ進行する

  const fingers = [{ ref: index, name: "index" }];
  const drawFingers = [
    { ref: fin0, name: "index" },
    { ref: fin1, name: "index" },
    { ref: fin2, name: "index" },
    { ref: fin3, name: "index" },
    { ref: fin4, name: "index" },
    { ref: fin5, name: "index" },
    { ref: fin6, name: "index" },
    { ref: fin7, name: "index" },
    { ref: fin8, name: "index" },
    { ref: fin9, name: "index" },
    { ref: fin10, name: "index" },
  ];

  useMemo(() => {
    const getJson = async () => {
      handmotion.current = await fetch("/json/2212131524.json").then((data) =>
        data.json()
      );
    };

    getJson();
  }, []);

  let elapsedTime = 0;
  let current = 0;

  useFrame((_, delta) => {
    elapsedTime += delta * 10;
    if (handmotion.current) {
      current++;
      current %= handmotion.current.length;
      const data = handmotion.current[Math.floor(current)];

      let correctedPoses;

      [keyframes.current, correctedPoses] = updatePoses({
        currentKeyframe: data,
        keyframes: keyframes.current,
      });

      // console.log(keyframes.current);

      for (let i = 0; i < 21; i++) {
        const i3 = i * 3;
        points.current[i] = [
          10 * correctedPoses[i3],
          -10 * correctedPoses[i3 + 1],
          10 * correctedPoses[i3 + 2],
        ];
      }

      for (let i = 0; i < drawFingers.length; i++) {
        const finger = drawFingers[i];
        const fingerPoints = [];
        fingerPoints.push(points.current[0]);
        for (let j = 5; j < 9; j++) {
          fingerPoints.push(points.current[j]);
        }
        if (finger.ref.current !== null) {
          // @ts-ignore
          finger.ref.current.geometry.setPositions(fingerPoints.flat());
        }
      }
    }
  });
  return (
    <>
      <group ref={groupRef}>
        {(() => {
          let lines = [];
          for (let i = 0; i < drawFingers.length; i++) {
            lines.push(
              <Line
                ref={drawFingers[i].ref}
                key={i}
                points={new Array(15).fill(0)}
                color="yellow"
                position={[0, 0, 0]}
                rotation={[0, (Math.PI * i) / 5, 0]}
                lineWidth={20}
              />
            );
          }
          return lines;
        })()}
      </group>
      <OrbitControls />
    </>
  );
}
