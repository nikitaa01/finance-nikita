import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([reactHooks.configs.flat.recommended ?? {}], {
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
});
