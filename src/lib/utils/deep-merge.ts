/* eslint-disable @typescript-eslint/no-explicit-any */
export function deepMerge(target: any, source: any): any {
  if (!source) return target;
  if (!target || typeof target !== "object" || Array.isArray(target)) {
    return source;
  }
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (key in target) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
