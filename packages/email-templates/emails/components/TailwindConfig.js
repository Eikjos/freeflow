"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TailwindConfig;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function TailwindConfig({ children }) {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsx)(components_1.Tailwind, { config: {
                    theme: {
                        fontSize: {
                            xs: "0.5rem",
                            sm: "0.8rem",
                            base: "1rem",
                            xl: "1.25rem",
                            "2xl": "1.5rem",
                            "3xl": "2rem",
                            "4xl": "2.5rem",
                            "5xl": "3rem",
                        },
                        fontFamily: {
                            display: ["Montserrat Medium", "sans-serif"],
                            body: ["Montserrat", "sans-serif"],
                        },
                        extend: {
                            borderRadius: {
                                lg: "0.5rem",
                                md: "calc(0.5rem - 2px)",
                                sm: "calc(0.5rem - 4px)",
                            },
                            colors: {
                                background: "white",
                                foreground: "hsl(0 0% 3.9%)",
                                card: {
                                    DEFAULT: "#f7f7ff",
                                    foreground: "hsl(0 0% 3.9%)",
                                },
                                popover: {
                                    DEFAULT: "hsl(0 0% 100%)",
                                    foreground: "hsl(0 0% 3.9%)",
                                },
                                primary: {
                                    DEFAULT: "#3e6450",
                                    foreground: "hsl(0 0% 98%)",
                                },
                                secondary: {
                                    DEFAULT: "#fea052",
                                    foreground: "hsl(0 0% 9%)",
                                },
                                muted: {
                                    DEFAULT: "hsl(0 0% 96.1%)",
                                    foreground: "hsl(0 0% 45.1%)",
                                },
                                accent: {
                                    DEFAULT: "#1f3618",
                                    foreground: "hsl(0 0% 9%)",
                                },
                                destructive: {
                                    DEFAULT: "hsl(0 84.2% 60.2%)",
                                    foreground: "hsl(0 0% 98%)",
                                },
                                border: "hsl(0 0% 89.8%)",
                                input: "hsl(0 0% 89.8%)",
                                ring: "hsl(0 0% 3.9%)",
                                chart: {
                                    1: "hsl(12 76% 61%)",
                                    2: "hsl(173 58% 39%)",
                                    3: "hsl(197 37% 24%)",
                                    4: "hsl(43 74% 66%)",
                                    5: "hsl(27 87% 67%)",
                                },
                            },
                        },
                    },
                }, children: (0, jsx_runtime_1.jsx)("div", { className: "font-display", children: children }) })] }));
}
