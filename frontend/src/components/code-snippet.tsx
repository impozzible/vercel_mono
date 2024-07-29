import React from 'react';

interface CodeSnippetProps {
  title: string;
  code: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ title, code }) => {
  return (
    <div className="code-snippet">
      <h2>{title}</h2>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
};
