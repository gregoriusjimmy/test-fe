# Worlder Web Frontend Boilerplate

This repository used for creating base projects with the following features:
- React v18.2.0
- Typescript v4.9.5
- Tailwind v.3.4.0
- Internationalization
- PWA

## How to Use Internationalization

For using internationalization, you need to add your new translation word inside each file under `public/locals` folder, then follow this example code:

```typescript
// import translation context
import { useTranslationContext } from "context/TranslationContext";

// call t for get translation from your key 
// call changeLanguage to change the language
const { t, changeLanguage } = useTranslationContext();

// put translation key as argument
t("translation_key")

// put language that you want to translate as argument
changeLanguage("en")
```

## How to Use PWA

PWA is already installed on this project, so you don't need to set up the PWA again, you just need to change the image under `public/images` folder then adjust some wording on file `manifest.json` under `public` folder.

## How to Use Tailwind

For using Tailwind, you just need to call the Tailwind CSS class name, please refer to [Tailwind documentation](https://tailwindcss.com/docs) for more styling resources.#   c h a t - f e  
 