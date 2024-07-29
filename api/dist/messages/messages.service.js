"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminMessage = exports.getProtectedMessage = exports.getPublicMessage = void 0;
const getPublicMessage = () => {
    return {
        text: "This is a public message. Codewords: public carrots",
    };
};
exports.getPublicMessage = getPublicMessage;
const getProtectedMessage = () => {
    return {
        text: "This is a protected message. Codewords: protected bananas",
    };
};
exports.getProtectedMessage = getProtectedMessage;
const getAdminMessage = () => {
    return {
        text: "This is an admin message.",
    };
};
exports.getAdminMessage = getAdminMessage;
