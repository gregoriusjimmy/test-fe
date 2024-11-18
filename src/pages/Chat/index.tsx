import React, {
  ChangeEvent,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowUp, Paperclip } from "lucide-react";
import Spinner from "components/Spinner";
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
import { CustomCSSProperties } from "types/index";
import { ID_AI_MODEL_LOGO_MAP } from "./constants";
import { routePaths, topicSlugParam } from "routes/constants";
import Markdown from "components/Markdown";



type CodeProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode // Make children optional to match expected HTMLAttributes
  node?: any 
}
const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [isFirstCreate, setIsFirstCreate] = useState(false);
  const [tempMessage, setTempMessage] = useState("");
  const selectedTopic = useTopicStore((state) => state.selectedTopic);
  const onSetTopics = useTopicStore((state) => state.onSetTopics);
  const selectedAIModel = useAIModelStore((state) => state.selectedAIModel);

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
    enabled: !!selectedTopic?.id && !isFirstCreate,
    queryKey: queryGetTopicMessages._key(String(selectedTopic?.id)),
    queryFn: () =>
      queryGetTopicMessages({ topicId: String(selectedTopic?.id) }),
    onSuccess: (res) => {
      const sortedMessages = [...res.data].sort((a, b) =>
        dayjs(a.createdAt).diff(dayjs(b.createdAt))
      );
      setMessages(sortedMessages);
      setIsFirstCreate(false);
    },
  });

  const {
    isPending: isPendingMutateCreateFirstMessage,
    mutate: mutateCreateFirstMessage,
  } = useMutation({
    mutationFn: mutationCreateFirstMessage,
    onSettled: () => {
      setTempMessage("");
    },
    onSuccess: (res) => {
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
    onSettled: () => {
      setTempMessage("");
    },
    onSuccess: (res) => {
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
    const textForSend = text.trim();
    setTempMessage(textForSend);
    setText("");
    adjustTextareaHeight()
    if (messages.length) {
      if (!selectedTopic?.id) return;
      mutateCreateMessage({
        message: textForSend,
        topicId: String(selectedTopic.id),
      });
      return;
    }
    setIsFirstCreate(true);
    mutateCreateFirstMessage({
      aiModelId: String(selectedAIModel.id),
      message: textForSend,
      userId: String(user.id),
    });
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustTextareaHeight()
  };

  const adjustTextareaHeight = () => {
      setTimeout(() => {
    if (textareaRef.current) {

        textareaRef.current.style.height = "auto"; //
  
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  
        const lineHeight = 24;
        const maxHeight = lineHeight * 2;
  
        if (textareaRef.current.scrollHeight > maxHeight) {
          textareaRef.current.style.overflowY = "scroll";
          textareaRef.current.style.height = `${maxHeight}px`;
        } else {
          textareaRef.current.style.overflowY = "hidden";
        }}
      }, 10); 
    
  };

  useEffect(() => {
    if (!selectedTopic?.id) {
      setMessages([]);
    }
  }, [selectedTopic?.id]);

  const loadingSend =
    isPendingMutateCreateFirstMessage || isPendingMutateCreateMessage;

  return (
    <div className="w-full relative h-full">
      <div className="flex flex-col items-center  h-[calc(100vh-14rem)]  mx-auto overflow-auto scrollbar">
        <div className="flex flex-col space-y-8 w-[75%] lg:w-[60%] mt-6">
          {isLoadingGetTopicMessages ? (
            <div className="flex flex-col space-y-8">
              <div className="bg-background-600 rounded-full animate-pulse-low text-foreground-200 ml-auto h-[2.1875rem] w-[80%]" />
              <div className="flex space-x-4 justify-start">
                <div
                  style={
                    {
                      "--pulse-duration": "3s",
                    } as CustomCSSProperties
                  }
                  className="bg-background-100 rounded-full w-8 h-8 animate-pulse-low shrink-0 "
                />
                <div className="flex flex-col w-full space-y-4 ">
                  {skeletons.map((skeleton, idx) => (
                    <div
                      key={idx}
                      style={
                        {
                          height: "1.75rem",
                          "--pulse-duration": skeleton.duration,
                          width: skeleton.width,
                        } as CustomCSSProperties
                      }
                      className="text-foreground-200 mt-1 bg-background-100 rounded-full animate-pulse-low"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div className="flex flex-col space-y-8" key={message.id}>
              <div
                style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                className="bg-background-600 py-2 px-6 rounded-3xl text-foreground-200 w-fit ml-auto"
              >
                {message.message}
              </div>
              <div className="flex space-x-4 justify-start">
                {selectedAIModel?.id && (
                  <div className="bg-background-500 rounded-full p-1 w-fit h-fit">
                    {ID_AI_MODEL_LOGO_MAP[selectedAIModel.id]}
                  </div>
                )}
            <Markdown message={message.response}/>
                </div>
              </div>)
            ))
          }
          {loadingSend && (
            <div className="flex flex-col space-y-8">
              <div
                style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                className="bg-background-600 py-2 px-6 rounded-3xl text-foreground-200 w-fit ml-auto"
              >
                {tempMessage}
              </div>
              <div className="flex space-x-4 justify-start">
                {selectedAIModel?.id && (
                  <div className="bg-background-500 rounded-full p-1 w-fit h-fit">
                    {ID_AI_MODEL_LOGO_MAP[selectedAIModel.id]}
                  </div>
                )}
                <div
                  style={
                    {
                      height: "1.75rem",
                      "--pulse-duration": "2s",
                      width: "50%",
                    } as CustomCSSProperties
                  }
                  className="text-foreground-200 mt-0.5 bg-background-100 rounded-full animate-pulse-low"
                />
              </div>
            </div>
          )}
        </div>
        <div
          className={cn(
            "absolute max-w-[80%] bottom-[3rem] w-[40rem] overflow-hidden  bg-background-800 flex flex-col border border-gray-700  pt-4 pb-5  rounded-full",
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
              disabled={loadingSend}
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <textarea
              ref={textareaRef}
              disabled={loadingSend}
              className="text-foreground-200 bg-transparent pl-[4rem] pr-[4rem] focus:outline-none max-h-[4rem] w-full resize-none no-scrollbar "
              placeholder={loadingSend ?'Processing...' :"Type a message..."}
              rows={1}
              value={text}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            />

            <button
              className="absolute bottom-0.5 right-0"
              onClick={handleClickSend}
              disabled={loadingFiles || loadingSend}
            >
              {loadingSend ? (
                <Spinner className="w-14 h-14" />
              ) : (
                <ArrowUp className="w-14 h-14 transition-colors hover:bg-background-500  rounded-full p-2 text-foreground-200" />
              )}
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

const generateRandom = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const skeletons = Array.from({ length: 1 }, (_, __) => ({
  duration: `${generateRandom(1, 5).toFixed(2)}s`, // Random duration between 2–5s
  width: `${generateRandom(50, 90).toFixed(2)}%`, // Random width between 50%–90%
}));

