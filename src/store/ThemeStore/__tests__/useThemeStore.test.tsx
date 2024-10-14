import { act } from "@testing-library/react";
import useThemeStore, { ETheme } from "..";

describe("useThemeStore", () => {
  const resetStore = () => {
    useThemeStore.setState({
      theme: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? ETheme.DARK
        : ETheme.LIGHT,
      loading: true,
    });
  };

  beforeEach(() => {
    document.documentElement.className = "";
    localStorage.clear();
    resetStore();
  });

  it("should initialize with the correct theme based on system preference", () => {
    const store = useThemeStore.getState();

    const matchMediaMock = jest.fn().mockImplementation((query) => ({
      matches: query.includes("dark"),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    window.matchMedia = matchMediaMock;

    store.onSetLoading(false);
    expect(store.theme).toBe(ETheme.DARK);
  });

  it("should set loading state correctly", async () => {
    const store = useThemeStore.getState();

    expect(store.loading).toBe(true);

    await act(async () => {
      store.onSetLoading(false);
    });

    const updatedStore = useThemeStore.getState();
    expect(updatedStore.loading).toBe(false);
  });

  it("should set the theme and apply it to the document", async () => {
    const store = useThemeStore.getState();

    await act(async () => {
      store.onSetTheme(ETheme.DARK);
    });

    expect(store.theme).toBe(ETheme.DARK);

    expect(document.documentElement.className).toBe("dark");
  });

  it("should rehydrate and apply the stored theme", async () => {
    localStorage.setItem(
      "theme-storage",
      JSON.stringify({ theme: ETheme.DARK })
    );
    let store = useThemeStore.getState();

    await act(async () => {
      const storedState = JSON.parse(
        localStorage.getItem("theme-storage") || "{}"
      );
      if (storedState.theme) {
        store.onSetTheme(storedState.theme);
      }
      store.onSetLoading(false);
    });
    store = useThemeStore.getState();
    expect(store.theme).toBe(ETheme.DARK);
    expect(document.documentElement.className).toBe("dark");
    expect(store.loading).toBe(false);
  });
});
