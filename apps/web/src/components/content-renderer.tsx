import type { ContentBlock } from "@genlayer-school/content";

export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-0">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2 key={index} className="text-xl font-bold mt-6 mb-2 text-foreground">
              {block.text}
            </h2>
          );
        }
        if (block.type === "paragraph") {
          return (
            <p key={index} className="mb-4 text-foreground leading-relaxed">
              {block.text}
            </p>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={index} className="mb-4 space-y-1 pl-2">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "callout") {
          return (
            <div key={index} className="bg-purple-50 border-l-4 border-purple-500 rounded-r-xl p-4 mb-4">
              <div className="font-semibold text-purple-700 mb-1">{block.title}</div>
              <div className="text-muted-foreground text-sm">{block.text}</div>
            </div>
          );
        }
        return (
          <pre key={index} className="bg-gray-900 text-gray-100 rounded-xl p-4 mb-4 overflow-x-auto text-sm">
            <code>{block.code}</code>
          </pre>
        );
      })}
    </div>
  );
}
