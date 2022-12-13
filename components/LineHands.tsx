import { OrbitControls, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Group, Vector3 } from "three";
import { updatePoses } from "../lib/updatePoses";
import * as THREE from "three";

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

  const fingers = [
    { ref: thumb, name: "thumb" },
    { ref: index, name: "index" },
    { ref: middle, name: "middle" },
    { ref: ring, name: "ring" },
    { ref: pinky, name: "pinky" },
  ];

  useMemo(() => {
    const getJson = async () => {
      handmotion.current = await fetch("/json/2212091336.json").then((data) =>
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
      const data = handmotion.current[current];

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

      for (let i = 0; i < fingers.length; i++) {
        const finger = fingers[i];
        const fingerPoints = [];
        fingerPoints.push(points.current[0]);
        for (let j = 4 * i + 1; j < 4 * (i + 1) + 1; j++) {
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
          for (const finger of fingers) {
            lines.push(
              <Line
                ref={finger.ref}
                key={finger.name}
                points={new Array(15).fill(0)}
                color="white"
                position={[0, 0, 0]}
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
