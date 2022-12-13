export const calcAverageKeypoints = (keyframes: number[][]) => {
  const keys: number[] = [];
  if (keyframes.length > 0) {
    for (let i = 0; i < 21; i++) {
      const i3 = i * 3;
      let totalWeight = 0;
      let val = { x: 0, y: 0, z: 0 };
      for (let j = 0; j < keyframes.length; j++) {
        const weight =
          (keyframes.length - 1) / 2 -
          Math.abs((keyframes.length - 1) / 2 - j) +
          1;
        totalWeight += weight;
        val.x += keyframes[j][i3] * weight;
        val.y += keyframes[j][i3 + 1] * weight;
        val.z += keyframes[j][i3 + 2] * weight;
      }
      keys.push(val.x / totalWeight);
      keys.push(val.y / totalWeight);
      keys.push(val.z / totalWeight);
    }

    return keys;
  } else {
    return [];
  }
};
