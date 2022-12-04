export const toId = (obj) => {
    if (obj._id) {
        return {
            ...obj,
            id: obj._id.toString()
        };
    }
    return obj;
};
//# sourceMappingURL=util.js.map