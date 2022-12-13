import { calcAverageKeypoints } from "./calcAverageKeypoints";

type Keyframe = {
  keypoints: number[];
  keypoints3D: number[];
  handedness: "Right" | "Left";
  score: number;
};

type Props = {
  currentKeyframe: Keyframe; // 現在のフレーム情報
  keyframes: number[][]; // 最大５フレーム分のこれまでのフレーム情報
};

type ReturnProps = [number[][], number[]];

export const updatePoses = ({
  currentKeyframe,
  keyframes,
}: Props): ReturnProps => {
  keyframes.push(currentKeyframe.keypoints3D);
  if (keyframes.length > 5) {
    keyframes.shift();
  }
  const correctedPoses = calcAverageKeypoints(keyframes);

  return [keyframes, correctedPoses];
};
