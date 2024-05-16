export const videoNameWithoutExtension = (name: string) => {
  const splitArray = name.split(".")
  splitArray.pop()
  return splitArray.join()
}
