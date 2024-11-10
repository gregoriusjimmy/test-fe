import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUp, Paperclip } from "lucide-react";

import File from "./components/File";

import {
  mutationCreateFirstMessage,
  mutationCreateMessage,
} from "api/messages";
import { queryGetTopicMessages } from "api/topics";
import { queryGetUserTopics } from "api/users";
import { replaceParamFromRoute } from "helpers/replaceParamFromRoute";
import cn from "lib/cn";
import { useQueryWithCallbacks } from "lib/react-query";
import useAIModelStore from "store/AIModel";
import useAuthStore from "store/AuthStore";
import useTopicStore from "store/TopicStore";

import { TMessage } from "api/messages/types";
import { routePaths, topicSlugParam } from "routes/constants";

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const selectedTopic = useTopicStore((state) => state.selectedTopic);
  const onSetTopics = useTopicStore((state) => state.onSetTopics);
  const selectedAIModel = useAIModelStore((state) => state.selectedAIModel);
  const [prevSelectedTopicId, setPrevSelectedTopicId] = useState(
    selectedAIModel?.id
  );
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<TMessage[]>([]);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (files.length + (event.target.files?.length ?? 0) > 5) return;

    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append new files to the existing list
    }
  };

  const { isLoading: isLoadingGetTopicMessages } = useQueryWithCallbacks({
    enabled: !!selectedTopic?.id && !messages.length,
    queryKey: queryGetTopicMessages._key(String(selectedTopic?.id)),
    queryFn: () =>
      queryGetTopicMessages({ topicId: String(selectedTopic?.id) }),
    onSuccess: (res) => {
      console.log("masuk get topic message");
      console.log("!messages.length", !messages.length);
      console.log("res.data", res.data);
      setMessages(res.data);
    },
  });

  const {
    isPending: isPendingMutateCreateFirstMessage,
    mutate: mutateCreateFirstMessage,
  } = useMutation({
    mutationFn: mutationCreateFirstMessage,
    onSuccess: (res) => {
      console.log("b");
      queryClient.invalidateQueries({
        queryKey: queryGetUserTopics._key(String(user.id)),
      });
      if (!selectedAIModel?.id) return;
      onSetTopics((prev) => [
        ...prev,
        {
          id: res.data.topicId,
          title: "",
          aiModelId: selectedAIModel.id,
          createdAt: "",
          pinned: false,
          updatedAt: "",
          userId: user.id,
        },
      ]);
      setMessages([res.data]);
      navigate(
        replaceParamFromRoute({
          param: topicSlugParam,
          route: routePaths.root.topic.root,
          value: String(res.data.topicId),
        })
      );
    },
  });

  const {
    isPending: isPendingMutateCreateMessage,
    mutate: mutateCreateMessage,
  } = useMutation({
    mutationFn: mutationCreateMessage,
    onSuccess: (res) => {
      console.log("a");
      console.log(res.data);
      setMessages((prev) => [...prev, res.data]);
    },
  });

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setLoadingFiles(true); // Start loading state

    // Simulate file upload
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("Files uploaded:", files);
        resolve(true);
      }, 2000); // Simulate a 2-second upload time
    });

    setLoadingFiles(false); // End loading state
    setFiles([]); // Reset selected files after upload
  };

  useEffect(() => {
    console.log(files);
  }, [files]);

  const imageURLs = files.map((file) => URL.createObjectURL(file));

  const handleRemove = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove)); // Remove the file from the list
    fileInputRef.current!.value = "";
  };
  useEffect(() => {
    return () => {
      imageURLs.forEach((url) => URL.revokeObjectURL(url)); // Clean up URLs
    };
  }, [imageURLs]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleClickSend();
    }
  };

  const handleClickSend = () => {
    if (!text || !selectedAIModel?.id) return;
    setText("");
    if (messages.length) {
      if (!selectedTopic?.id) return;
      mutateCreateMessage({
        message: text,
        topicId: String(selectedTopic?.id),
      });
      return;
    }
    mutateCreateFirstMessage({
      aiModelId: String(selectedAIModel.id),
      message: text,
      userId: String(user.id),
    });
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to auto to correctly calculate new scroll height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (selectedTopic?.id !== prevSelectedTopicId) {
      console.log("masuk use");
      setMessages([]);
      setPrevSelectedTopicId(selectedTopic?.id);
    }
  }, [prevSelectedTopicId, selectedTopic?.id]);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center  h-[calc(100vh-14rem)]  mx-auto overflow-auto scrollbar">
        <div className="flex flex-col space-y-8 w-[50rem] mt-6">
          {isLoadingGetTopicMessages ? (
            <div>
              <div className="bg-background-600 rounded-full text-foreground-200 ml-auto h-[2.87rem] w-[4rem]" />
            </div>
          ) : (
            messages.map((message) => (
              <div className="flex flex-col space-y-8" key={message.id}>
                <div className="bg-background-600  py-2 px-6 rounded-full text-foreground-200 w-fit ml-auto">
                  {message.message}
                </div>
                <div className="text-foreground-200">{message.response}</div>
              </div>
            ))
          )}
        </div>

        <div
          className={cn(
            "fixed bottom-[3rem] w-[40rem] overflow-hidden  bg-background-800 flex flex-col border border-gray-700  pt-4 pb-5  rounded-full",
            files.length && "rounded-lg"
          )}
        >
          {files.length > 0 && (
            <ul className="px-3 mb-5 flex space-x-3 overflow-auto">
              {files.map((file, index) => (
                <File onRemove={handleRemove} file={file} key={index} />
              ))}
            </ul>
          )}
          <div className="flex items-center">
            <button
              className="absolute bottom-2.5 left-3 "
              onClick={handleFileInputClick}
            >
              <Paperclip className="w-10 h-10 transition-colors hover:bg-background-500 rounded-full p-2 text-foreground-200" />
            </button>

            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <textarea
              ref={textareaRef}
              disabled={
                isPendingMutateCreateFirstMessage ||
                isPendingMutateCreateMessage
              }
              className="text-foreground-200 bg-transparent pl-[4rem] pr-[4rem] focus:outline-none max-h-[4rem] w-full resize-none no-scrollbar "
              placeholder="Type a message..."
              rows={1}
              value={text}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            />

            <button
              className="absolute bottom-0.5 right-0"
              onClick={handleClickSend}
              disabled={loadingFiles}
            >
              <ArrowUp className="w-14 h-14 transition-colors hover:bg-background-500  rounded-full p-2 text-foreground-200" />
            </button>
          </div>
        </div>
        {/* Show loading message while files are being uploaded */}
        {loadingFiles && <p className="text-blue-600">Uploading files...</p>}
      </div>
    </div>
  );
};

export default App;
