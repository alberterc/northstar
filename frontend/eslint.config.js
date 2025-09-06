import js from "@eslint/js";

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				document: true,
				window: true,
				console: true,
			},
		},
		rules: {
			"no-unused-vars": "warn",
			"no-console": "off",
			semi: ["error", "always"],
			quotes: ["error", "double"],
		},
	},
];
