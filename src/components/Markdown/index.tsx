import React, { useEffect, useMemo } from "react";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { Marked, Renderer, Tokens } from "marked";
import "highlight.js/styles/github-dark.css"; // Choose a Highlight.js theme

interface MarkdownProps {
  message: string;
}

// Create a custom renderer


// Initialize Marked with marked-highlight plugin and custom renderer
const marked = new Marked(
  markedHighlight({
    async: false,
    langPrefix: "hljs language-", // Add classes for Highlight.js
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value; // Fallback to auto-detection
    },
  })
);

// Use the custom renderer

const Markdown: React.FC<MarkdownProps> = ({ message }) => {
  // Synchronously convert Markdown to HTML
  const htmlContent = useMemo(() => {
    if (!message) return '';
    return marked.parse(message) as string;
  }, [message]);

  useEffect(() => {
    // Apply the 'scrollbar' class to all <pre> elements
    const preElements = document.querySelectorAll('code');
    const preElements1 = document.querySelectorAll('pre');
    preElements1.forEach((pre) => {
      pre.classList.add('relative');
    });
    preElements.forEach((pre) => {
      pre.classList.add('scrollbar');
    });
    const codeBlocks = document.querySelectorAll('pre code.hljs');
    codeBlocks.forEach((block) => {
      // Check if the copy button already exists
      const nextSibling = block.nextSibling as HTMLElement;
      if (!nextSibling?.classList?.contains('copy-button')) {
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.className = 'copy-button'; // Style this button as you prefer
        copyButton.onclick = () => {
          const code = block.textContent || '';
          navigator.clipboard.writeText(code).then(() => {
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied'; // Change button text to "Copied"
            // Change it back to "Copy" after 2 seconds
            setTimeout(() => {
              copyButton.textContent = originalText;
            }, 2000);
          }).catch((err) => {
            alert('Failed to copy: ' + err);
          });
        };
        block.parentElement?.appendChild(copyButton); // Append button to the code block
      }
    });
  }, [htmlContent]);
  
  return (
    <div
      className="markdown overflow-auto -mt-4 scrollbar"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default Markdown;