"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Header;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function Header({ clientUrl }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-11/12 mx-auto px-4 py-2 bg-card flex flex-row items-center mt-5 rounded-lg", children: [(0, jsx_runtime_1.jsx)(components_1.Img, { src: `${clientUrl}/assets/freeflow.png`, width: "50", height: "50" }), (0, jsx_runtime_1.jsx)("span", { className: "text-4xl font-amica font-semibold ml-4", children: "Freeflow" })] }));
}
