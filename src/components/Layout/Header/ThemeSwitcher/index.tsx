import { Moon, Sun } from "lucide-react";

import useThemeStore, { ETheme } from "store/ThemeStore";

const ThemeSwitcher = () => {
  const theme = useThemeStore((state) => state.theme);
  const onSetTheme = useThemeStore((state) => state.onSetTheme);

  const handleToggleTheme = () => {
    console.log(theme);
    if (theme === ETheme.DARK) {
      onSetTheme(ETheme.LIGHT);
    } else {
      onSetTheme(ETheme.DARK);
    }
  };

  return (
    <button onClick={handleToggleTheme}>
      {theme === ETheme.DARK ? (
        <Sun className="w-8 h-8 text-foreground-200" />
      ) : (
        <Moon className="w-8 h-8 text-foreground-200" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
