import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "next/typescript",
      "plugin:tailwindcss/recommended",
      "plugin:prettier/recommended",
    ],
    plugins: ["eslint-plugin-react-compiler"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "tailwindcss/classnames-order": "error",
      "tailwindcss/no-custom-classname": ["error", { whitelist: ["toaster"] }],
      "tailwindcss/no-contradicting-classname": "error",
      "react-compiler/react-compiler": "error",
      "prettier/prettier": "error",
    },
  }),
];

export default eslintConfig;
