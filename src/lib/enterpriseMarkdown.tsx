import React from "react";

/* ================================
   TYPES
================================ */

type Block =
  | { type: "paragraph"; content: React.ReactNode[] }
  | { type: "heading"; level: number; content: React.ReactNode[] }
  | { type: "ul"; items: React.ReactNode[][] }
  | { type: "ol"; items: React.ReactNode[][] }
  | { type: "quote"; content: React.ReactNode[] };

/* ================================
   INLINE PARSER
================================ */

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex =
    /(\*\*([^\*]+)\*\*|\*([^\*]+)\*|\[([^\]]+)\]\(([^)]+)\))/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const [full, , bold, italic, linkText, linkUrl] = match;

    if (bold) {
      parts.push(<strong key={match.index}>{bold}</strong>);
    } else if (italic) {
      parts.push(<em key={match.index}>{italic}</em>);
    } else if (linkText && linkUrl) {
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          {linkText}
        </a>
      );
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

/* ================================
   BLOCK PARSER
================================ */

function parseBlocks(content: string): Block[] {
  const lines = content
    .replace(/\\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const blocks: Block[] = [];

  let ulBuffer: React.ReactNode[][] = [];
  let olBuffer: React.ReactNode[][] = [];

  function flushLists() {
    if (ulBuffer.length) {
      blocks.push({ type: "ul", items: ulBuffer });
      ulBuffer = [];
    }
    if (olBuffer.length) {
      blocks.push({ type: "ol", items: olBuffer });
      olBuffer = [];
    }
  }

  lines.forEach((line) => {
    // Heading
    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushLists();
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        content: parseInline(headingMatch[2]),
      });
      return;
    }

    // Blockquote
    if (/^>\s+/.test(line)) {
      flushLists();
      blocks.push({
        type: "quote",
        content: parseInline(line.replace(/^>\s+/, "")),
      });
      return;
    }

    // Unordered list
    if (/^[-*•]\s+/.test(line)) {
      ulBuffer.push(parseInline(line.replace(/^[-*•]\s+/, "")));
      return;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      olBuffer.push(parseInline(line.replace(/^\d+\.\s+/, "")));
      return;
    }

    // Normal paragraph
    flushLists();
    blocks.push({
      type: "paragraph",
      content: parseInline(line),
    });
  });

  flushLists();
  return blocks;
}

/* ================================
   RENDERER
================================ */

export function renderMarkdown(content?: string) {
  if (!content) return null;

  const blocks = parseBlocks(content);

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading": {
            const level = Math.min(Math.max(block.level, 1), 6);
            const Tag = `h${level}` as React.ElementType;

            return (
              <Tag
                key={i}
                className="font-heading font-semibold mt-4 mb-2"
              >
                {block.content}
              </Tag>
            );
          }

          case "paragraph":
            return (
              <p
                key={i}
                className="text-sm md:text-base text-muted leading-[1.6]"
              >
                {block.content}
              </p>
            );

          case "ul":
            return (
              <ul
                key={i}
                className="ml-5 list-disc space-y-1 text-sm md:text-base text-muted"
              >
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol
                key={i}
                className="ml-5 list-decimal space-y-1 text-sm md:text-base text-muted"
              >
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-primary pl-4 italic text-muted my-3"
              >
                {block.content}
              </blockquote>
            );

          default:
            return null;
        }
      })}
    </>
  );
}