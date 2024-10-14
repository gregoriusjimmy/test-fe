import { useCallback, useEffect, useState } from "react";

import { db } from "services/indexedDB";

const MAX_KEYS = 10;
const MAX_MESSAGES_PER_KEY = 50;

type TValue = {
  timestamp: string;
  messages: any[];
};

export const useIndexedDBMessage = (
  channelId: string,
  defaultMessages = []
) => {
  const [value, setValue] = useState<TValue>({
    timestamp: new Date().toISOString(),
    messages: defaultMessages,
  });

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesEntry = await db.messages.where({ channelId }).first();
      if (messagesEntry) {
        setValue({
          timestamp: messagesEntry.timestamp,
          messages: messagesEntry.messages,
        });
      }
    };
    fetchMessages();
  }, [channelId]);

  const handleStorage = useCallback(async () => {
    try {
      const messagesEntry = {
        channelId,
        timestamp: value.timestamp,
        messages: value.messages.slice(-MAX_MESSAGES_PER_KEY), // Keep only the latest messages
      };

      await db.messages.put(messagesEntry);
      manageDexieDBSize();
    } catch (error) {
      console.error("Failed to store chat in IndexedDB:", error);
    }
  }, [value, channelId]);

  useEffect(() => {
    handleStorage();
  }, [handleStorage]);

  // Function to manage the total number of keys in IndexedDB
  const manageDexieDBSize = async () => {
    const count = await db.messages.count();
    if (count > MAX_KEYS) {
      // Remove the oldest chat entry
      const oldest = await db.messages.orderBy("timestamp").first();
      if (oldest) await db.messages.delete(oldest.id);
    }
  };

  const addMessage = (newMessage: any) => {
    setValue((prevState) => ({
      ...prevState,
      timestamp: new Date().toISOString(), // Update timestamp
      messages: [...prevState.messages, { text: newMessage }],
    }));
  };

  const setMessages = (messages: any) => {
    setValue({
      timestamp: new Date().toISOString(),
      messages,
    });
  };

  return { messages: value, addMessage, setMessages };
};
