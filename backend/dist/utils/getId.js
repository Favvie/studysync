// Not done yet
export const getUserId = (req, res) => {
    var _a;
    const userId = (_a = req.customData) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        return res
            .status(400)
            .json({ success: false, msg: "Unauthorized Access" });
    }
    return userId;
};
export const getGroupId = (req, res) => {
    const groupId = req.params.groupId;
    if (!groupId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    return groupId;
};
export const getFileId = (req, res) => {
    const { fileId } = req.params;
    if (!fileId) {
        return res.status(400).json({
            success: false,
            msg: "FileId is missing",
        });
    }
    return fileId;
};
