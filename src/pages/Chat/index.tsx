import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import Markdown from "components/Markdown";
import File from "./components/File";
import InputBox from "./components/InputBox";

import {
  mutationCreateFirstMessage,
  mutationCreateMessage,
} from "api/messages";
import { queryGetTopicMessages } from "api/topics";
import { queryGetUserTopics } from "api/users";
import { replaceParamFromRoute } from "helpers/replaceParamFromRoute";
import { useQueryWithCallbacks } from "lib/react-query";
import useAIModelStore from "store/AIModel";
import useAuthStore from "store/AuthStore";
import useTopicStore from "store/TopicStore";

import { TMessage } from "api/messages/types";
import { CustomCSSProperties } from "types/index";
import { ID_AI_MODEL_LOGO_MAP } from "./constants";
import { routePaths, topicSlugParam } from "routes/constants";

const App: React.FC = () => {
  const [tempFile, setTempFile] = useState<File>();
  const [isFirstCreate, setIsFirstCreate] = useState(false);
  const [tempMessage, setTempMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<TMessage[]>([]);

  const selectedTopic = useTopicStore((state) => state.selectedTopic);
  const onSetTopics = useTopicStore((state) => state.onSetTopics);
  const selectedAIModel = useAIModelStore((state) => state.selectedAIModel);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

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
      setFiles([]);
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
      setFiles([]);
      setTempMessage("");
    },
    onSuccess: (res) => {
      if (
        selectedTopic?.updatedAt &&
        !dayjs(selectedTopic.updatedAt).isSame(dayjs(), "day")
      ) {
        queryClient.invalidateQueries({
          queryKey: queryGetUserTopics._key(String(user.id)),
        });
      }
      setMessages((prev) => [...prev, res.data]);
    },
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, 10);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (files.length + (event.target.files?.length ?? 0) > 1) return;

    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  const handleClickSend = () => {
    if (!text || !selectedAIModel?.id) return;
    const textForSend = text.trim();
    setTempMessage(textForSend);
    setText("");
    setFiles([]);
    scrollToBottom();

    if (messages.length) {
      if (!selectedTopic?.id) return;
      mutateCreateMessage({
        message: textForSend,
        topicId: String(selectedTopic.id),
        file: files?.[0] ?? null,
      });
      return;
    }
    setIsFirstCreate(true);
    mutateCreateFirstMessage({
      aiModelId: String(selectedAIModel.id),
      message: textForSend,
      userId: String(user.id),
      file: files?.[0] ?? null,
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  const handleRemove = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove)); // Remove the file from the list
  };

  const loadingSend =
    isPendingMutateCreateFirstMessage || isPendingMutateCreateMessage;

  const tempImageURL = tempFile ? URL.createObjectURL(tempFile) : "";

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(tempImageURL);
    };
  }, [tempImageURL]);

  useEffect(() => {
    setText("");
    if (!selectedTopic?.id) {
      setMessages([]);
    }
  }, [selectedTopic?.id]);

  return (
    <div className="w-full relative h-full">
      <div
        ref={containerRef}
        className="flex flex-col items-center  h-[calc(100vh-14rem)]  mx-auto overflow-auto scrollbar"
      >
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
                <div className="flex flex-col">
                  <div
                    style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                    className="bg-background-600 py-2 px-6 rounded-3xl text-foreground-200 w-fit ml-auto"
                  >
                    {message.message}
                  </div>
                  {message.file && (
                    <img
                      className=""
                      src={message.file}
                      width={200}
                      height={200}
                      alt=""
                    />
                  )}
                </div>
                <div className="flex space-x-4 justify-start">
                  {selectedAIModel?.id && (
                    <div className="bg-background-500 rounded-full p-1 w-fit h-fit">
                      {ID_AI_MODEL_LOGO_MAP[selectedAIModel.id]}
                    </div>
                  )}
                  <Markdown message={message.response} />
                </div>
              </div>
            ))
          )}
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
                  className="text-foreground-200 mt-1 bg-background-100 rounded-full animate-pulse-low"
                />
              </div>
            </div>
          )}
        </div>
        <InputBox
          text={text}
          files={files}
          onInput={handleInput}
          onFileChange={handleFileChange}
          onSend={handleClickSend}
          onRemove={handleRemove}
          loadingSend={loadingSend}
        />
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
