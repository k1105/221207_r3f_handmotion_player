import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Group } from "three";
import { updatePoses } from "../lib/updatePoses";
import * as THREE from "three";

type Keyframe = {
  keypoints: number[];
  keypoints3D: number[];
  handedness: "Right" | "Left";
  score: number;
};

export default function Hands() {
  const groupRef = useRef<Group>(null);
  const handmotion = useRef<Keyframe[]>();
  const keyframes = useRef<number[][]>([]);

  useMemo(() => {
    const getJson = async () => {
      handmotion.current = await fetch("/json/2212091336.json").then((data) =>
        data.json()
      );
    };

    getJson().then(() => {
      //      console.log(handmotion.current);
    });
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
        groupRef.current?.children[i].position.set(
          10 * correctedPoses[i3],
          -10 * correctedPoses[i3 + 1],
          10 * correctedPoses[i3 + 2]
        );
      }
    }
  });
  return (
    <>
      <group ref={groupRef}>
        {(() => {
          const meshes = [];
          for (let i = 0; i < 21; i++) {
            meshes.push(
              <mesh scale={[0.1, 0.1, 0.1]} key={`point${i}`}>
                <sphereGeometry />
                <meshBasicMaterial color={"white"} wireframe={true} />
              </mesh>
            );
          }
          return meshes;
        })()}
      </group>
      <OrbitControls />
    </>
  );
}
