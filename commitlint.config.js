// https://commitlint.js.org/#/reference-rules
module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [2, "always", [
				"feat",
				"fix",
				"perf",
				"style",
				"chore",
				"build",
				"docs",
				"refactor",
				"revert",
				"test",
        "build"
			],
		],
	},
};