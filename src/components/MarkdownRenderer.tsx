import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className = "" }: MarkdownRendererProps) => {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-black mb-4 mt-6 text-foreground">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-black mb-3 mt-5 text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold mb-2 mt-4 text-foreground">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-foreground leading-relaxed mb-3">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-black text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc ml-6 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-6 mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground">{children}</li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
