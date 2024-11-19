import { ChangeEvent, KeyboardEvent, useEffect, useRef } from "react";
import { ArrowUp,Paperclip } from "lucide-react";

import Spinner from "components/Spinner";
import File from "../File";

import cn from "lib/cn";


interface InputBoxProps {
  files: File[];
  loadingSend: boolean;
  text: string;
  onSend: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (fileToRemove: File) => void;
  onInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const InputBox = ({
  files,
  loadingSend,
  text,
  onSend,
  onRemove,
  onFileChange,
  onInput,
}: InputBoxProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileInputClick = () => {
    if (files.length >= 1) return;
    fileInputRef.current?.click();
  };

  const imageURLs = files.map((file) => URL.createObjectURL(file));

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onSend();
    }
  };

  useEffect(() => {
    return () => {
      imageURLs.forEach((url) => URL.revokeObjectURL(url)); // Clean up URLs
    };
  }, [imageURLs]);

  const handleRemove = (fileToRemove: File) => {
    onRemove(fileToRemove);
    fileInputRef.current!.value = "";
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInput(e);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; //

        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

        const lineHeight = 24;
        const maxHeight = lineHeight * 6;

        if (textareaRef.current.scrollHeight > maxHeight) {
          textareaRef.current.style.overflowY = "scroll";
          textareaRef.current.style.height = `${maxHeight}px`;
        } else {
          textareaRef.current.style.overflowY = "hidden";
        }
      }
    }, 10);
  };

  const handleClickSend = () => {
    onSend();
    adjustTextareaHeight();
  };

  return (
    <div
      className={cn(
        "absolute max-w-[80%] bottom-[3rem] w-[40rem] overflow-hidden  bg-background-800 flex flex-col border border-gray-700  pt-4 pb-5  rounded-3xl",
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
          disabled={files.length >= 1}
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
          onChange={onFileChange}
          className="hidden"
        />

        <textarea
          ref={textareaRef}
          disabled={loadingSend}
          className="text-foreground-200 bg-transparent pl-[4rem] pr-[4rem] focus:outline-none  w-full resize-none no-scrollbar "
          placeholder={loadingSend ? "Processing..." : "Type a message..."}
          rows={1}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />

        <button
          className="absolute bottom-0.5 right-0"
          onClick={handleClickSend}
          disabled={loadingSend}
        >
          {loadingSend ? (
            <Spinner className="w-14 h-14" />
          ) : (
            <ArrowUp className="w-14 h-14 transition-colors hover:bg-background-500  rounded-full p-2 text-foreground-200" />
          )}
        </button>
      </div>
    </div>
  );
};

export default InputBox;
