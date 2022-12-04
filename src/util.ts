export const toId = (obj: any) => {
  if (obj._id) {
    return {
      ...obj,
      id: obj._id.toString()
    }
  }
  return obj;
}