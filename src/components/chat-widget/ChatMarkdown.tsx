/**
 * ChatMarkdown
 *
 * A compact markdown renderer tailored for chat bubbles.
 * Reuses the existing react-markdown stack (react-markdown, remark-gfm, rehype-raw).
 * Styling is scaled down for the narrow chat context.
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import { cn } from "@/src/lib/utils";

interface ChatMarkdownProps {
  content: string;
  className?: string;
}

export function ChatMarkdown({ content, className }: ChatMarkdownProps) {
  return (
    <div className={cn("chat-markdown text-sm leading-relaxed", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Paragraphs
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,

          // Headings — scaled for chat width
          h1: ({ children }) => (
            <h1 className="text-base font-bold text-gray-900 mb-2 mt-3 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-gray-900 mb-1.5 mt-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-gray-800 mb-1 mt-2 first:mt-0">
              {children}
            </h3>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-4 mb-2 space-y-0.5">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-4 mb-2 space-y-0.5">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-snug">{children}</li>,

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary-600 hover:text-primary-700 underline underline-offset-2 transition-colors"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),

          // Strong / em
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700">{children}</em>
          ),

          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary-300 pl-3 py-0.5 my-2 italic text-gray-600 bg-primary-50/50 rounded-r">
              {children}
            </blockquote>
          ),

          // Inline & block code
          code: ({ children, className: codeClass }) => {
            const isInline = !codeClass || !codeClass.startsWith("language-");
            if (isInline) {
              return (
                <code className="bg-gray-100 text-primary-700 px-1 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto my-2 font-mono text-xs">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-2 overflow-x-auto rounded-lg">{children}</pre>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-2 rounded border border-gray-200">
              <table className="min-w-full text-xs divide-y divide-gray-200">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-primary-50">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-100">{children}</tbody>
          ),
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="px-3 py-1.5 text-left font-medium text-primary-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-1.5 text-gray-700">{children}</td>
          ),

          // Horizontal rule
          hr: () => <hr className="my-3 border-gray-200" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
