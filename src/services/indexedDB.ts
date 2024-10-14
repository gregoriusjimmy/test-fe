import Dexie, { type EntityTable } from "dexie";

export type TIndexedDBMessage = {
  id: string;
  channelId: string;
  timestamp: string;
  messages: any[];
};

const db = new Dexie("CommunicatorDB") as Dexie & {
  messages: EntityTable<TIndexedDBMessage, "id">;
};

db.version(1).stores({
  messages: "++id, channelId, timestamp",
  zustandStorage: "key,value",
});

const indexedDBStorage = {
  getItem: async (name: string) => {
    const item = await db.table("zustandStorage").get(name);
    return item ? item.value : null;
  },
  setItem: async (name: string, value: any) => {
    await db.table("zustandStorage").put({ key: name, value });
  },
  removeItem: async (name: string) => {
    await db.table("zustandStorage").delete(name);
  },
};

export { db, indexedDBStorage };
