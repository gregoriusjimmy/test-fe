import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { ArrowUp, Paperclip } from "lucide-react";

import File from "./components/File";

import cn from "lib/cn";

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (files.length + (event.target.files?.length ?? 0) > 5) return;

    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append new files to the existing list
    }
  };

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

  return (
    <div className="w-full">
      <div className="flex flex-col items-center max-w-[40rem] w-full mx-auto">
        <div>Is it okay to drink supplement iron before breakfast?</div>
        <div
          className={cn(
            "fixed bottom-[3rem] w-[40rem] overflow-hidden  bg-background-800  border border-gray-700  pt-4 pb-5  rounded-full",
            files.length && "rounded-lg"
          )}
        >
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

          {files.length > 0 && (
            <ul className="px-3 mb-3 flex space-x-3 overflow-auto">
              {files.map((file, index) => (
                <File onRemove={handleRemove} file={file} key={index} />
              ))}
            </ul>
          )}
          <input
            type="text"
            className="text-foreground-200 bg-transparent pl-[4rem] pr-[4rem] focus:outline-none w-full "
            placeholder="Type a message..."
          />

          <button
            className="absolute bottom-0.5 right-0"
            onClick={handleUpload}
            disabled={loadingFiles}
          >
            <ArrowUp className="w-14 h-14 transition-colors hover:bg-background-500  rounded-full p-2 text-foreground-200" />
          </button>
        </div>
        {/* Show loading message while files are being uploaded */}
        {loadingFiles && <p className="text-blue-600">Uploading files...</p>}
      </div>
    </div>
  );
};

export default App;
