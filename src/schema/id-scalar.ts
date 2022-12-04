export const idScalar = (root: any) => {
  if (root.id) return root.id;
  if (root._id) {
    return root._id.toString();
  }
}