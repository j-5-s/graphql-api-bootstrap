export const idScalar = (root) => {
    if (root.id)
        return root.id;
    if (root._id) {
        return root._id.toString();
    }
};
//# sourceMappingURL=id-scalar.js.map