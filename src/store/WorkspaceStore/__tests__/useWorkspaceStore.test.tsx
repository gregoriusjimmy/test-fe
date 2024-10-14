import { act } from "@testing-library/react";
import { TWorkspace } from "api/chat/types";
import useWorkspaceStore from "..";

describe("useWorkspaceStore", () => {
  const mockWorkspace: TWorkspace = {
    id: "1",
    idEntity: "entity-1",
    entityType: "type-1",
    name: "Workspace 1",
    uniqueId: "unique-1",
    description: "Test Workspace 1",
    imageProfile: "image-url-1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  };

  const mockWorkspaceList: TWorkspace[] = [
    {
      id: "1",
      idEntity: "entity-1",
      entityType: "type-1",
      name: "Workspace 1",
      uniqueId: "unique-1",
      description: "Test Workspace 1",
      imageProfile: "image-url-1",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
    },
    {
      id: "2",
      idEntity: "entity-2",
      entityType: "type-2",
      name: "Workspace 2",
      uniqueId: "unique-2",
      description: "Test Workspace 2",
      imageProfile: "image-url-2",
      createdAt: "2024-01-03T00:00:00Z",
      updatedAt: "2024-01-04T00:00:00Z",
    },
  ];

  const resetStore = () => {
    useWorkspaceStore.setState({
      workspaceList: [],
      selectedWorkspace: null,
      lastSavedWorkspace: null,
    });
  };

  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  it("should initialize with default values", () => {
    const store = useWorkspaceStore.getState();

    expect(store.workspaceList).toEqual([]);
    expect(store.selectedWorkspace).toBeNull();
    expect(store.lastSavedWorkspace).toBeNull();
  });

  it("should set workspace list", () => {
    const store = useWorkspaceStore.getState();

    act(() => {
      store.onSetWorkspaceList(mockWorkspaceList);
    });

    const updatedStore = useWorkspaceStore.getState();
    expect(updatedStore.workspaceList).toEqual(mockWorkspaceList);
  });

  it("should set selected workspace", () => {
    const store = useWorkspaceStore.getState();

    act(() => {
      store.onSetSelectedWorkspace(mockWorkspace);
    });

    const updatedStore = useWorkspaceStore.getState();
    expect(updatedStore.selectedWorkspace).toEqual(mockWorkspace);
  });

  it("should set last saved workspace", () => {
    const store = useWorkspaceStore.getState();

    act(() => {
      store.onSetLastSavedWorkspace(mockWorkspace);
    });

    const updatedStore = useWorkspaceStore.getState();
    expect(updatedStore.lastSavedWorkspace).toEqual(mockWorkspace);
  });

  it("should persist last saved workspace to localStorage", () => {
    const store = useWorkspaceStore.getState();

    act(() => {
      store.onSetLastSavedWorkspace(mockWorkspace);
    });

    const storedState = JSON.parse(
      localStorage.getItem("workspace-storage") || "{}"
    );

    expect(storedState).toHaveProperty("state.lastSavedWorkspace");
    expect(storedState.state.lastSavedWorkspace).toEqual(mockWorkspace);
  });
});
