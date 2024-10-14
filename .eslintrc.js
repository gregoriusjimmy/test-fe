module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "unused-imports",
    "simple-import-sort",
  ],
  ignorePatterns: ["*.js", "*.test.tsx"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react/display-name": "off",
    //#region  //*=========== Typescript Eslint===========
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    //#region  //*=========== Unused Import ===========
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    //#region  //*=========== Import Sort ===========
    "simple-import-sort/exports": "warn",
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          // Packages. `react` related packages come first.
          ["^react", "^.*@testing.*", "^"],
          //Component
          [
            "^.*(View|UI|@ui).*",
            "^components/(?!.*(types|@type|constants|endpoint)).*",
            "^pages/(?!.*(types|@type|constants|endpoint|\\.css|helpers|api|services|queries|mutations|context|store|Model|Controller|UseCase|hooks|lib))",
            "^.*/([A-Z]w+)(?<!.css)$",
            "^../(?!.*(types|@type|constants|endpoint|\\.css|use|helpers|api|services|queries|mutations|context|store|Model|Controller|UseCase|hooks|lib)).*",
            "^./(?!.*(types|@type|constants|endpoint|\\.css|use|helpers|api|services|queries|mutations|context|store|Model|Controller|UseCase|hooks|lib)).*",
          ],
          // Function.
          [
            "^.*(helpers|api|services|use|hooks|lib|context|store|UseCase|Controller)(?!.*(types|constants|endpoint)).*",
          ],
          // Constant, Types
          [
            "^(\\.\\/types|\\/types|[^\\/]+\\/types|\\*constants\\/\\*|\\*endpoint\\/\\*)",
            "^.*(types|types/|__samples__|config).*",
            "^.*(mutations|queries/).*",
            "^.*(constants|endpoint|queries|@type|routes|__samples__/|typing|@type|Model/.*[Yy][Uu][Pp][Ss][Cc][Hh][Ee][Mm][Aa]|Model/yup|Model/mutations|\\.*mutations|\\.*queries|\\.*constant|\\.*types).*$",
          ],
          // CSS
          ["\\.css$"],
        ],
      },
    ],
    //#endregion  //*======== Import Sort ===========
  },
};
