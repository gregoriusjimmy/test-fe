import { getUser } from "api/user";
import { getCookies, setCookies, clearCookies } from "helpers/cookies";
import { ECOOKIES_KEY } from "constants/index";
import useAuthStore, { DUMMY_USER } from "..";
import { act } from "@testing-library/react";

jest.mock("api/user", () => ({
  getUser: jest.fn(),
}));

jest.mock("helpers/cookies", () => ({
  getCookies: jest.fn(),
  setCookies: jest.fn(),
  clearCookies: jest.fn(),
}));

describe("useAuthStore", () => {
  const mockUser = {
    ...DUMMY_USER,
    id: "123",
    email: "test@example.com",
    active: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { isLogin, loading, user } = useAuthStore.getState();
    expect(isLogin).toBe(false);
    expect(loading).toBe(false);
    expect(user).toEqual(expect.objectContaining({ id: "" }));
  });

  it("should set user data correctly on successful getUserData call", async () => {
    (getCookies as jest.Mock).mockReturnValue("mock_token");
    (getUser as jest.Mock).mockResolvedValueOnce({ data: mockUser });

    await act(async () => {
      useAuthStore.getState().getUserData();
    });

    const { isLogin, user, loading } = useAuthStore.getState();

    expect(loading).toBe(false);
    expect(isLogin).toBe(true);
    expect(user).toEqual(mockUser);
    expect(setCookies).toHaveBeenCalledWith(ECOOKIES_KEY.EMAIL, mockUser.email);
  });

  it("should handle error correctly when getUserData fails", async () => {
    (getCookies as jest.Mock).mockReturnValue("mock_token");
    (getUser as jest.Mock).mockRejectedValueOnce(new Error("Failed to fetch"));

    await act(async () => {
      useAuthStore.getState().getUserData();
    });

    const { isLogin, user, loading } = useAuthStore.getState();

    expect(loading).toBe(false);
    expect(isLogin).toBe(false);
    expect(user.id).toBe("");
    expect(clearCookies).toHaveBeenCalled();
  });

  it("should handle missing token (user not logged in)", async () => {
    (getCookies as jest.Mock).mockReturnValue(null);

    await act(async () => {
      useAuthStore.getState().getUserData();
    });

    const { isLogin, user } = useAuthStore.getState();

    expect(isLogin).toBe(false);
    expect(user.id).toBe("");
  });
});
