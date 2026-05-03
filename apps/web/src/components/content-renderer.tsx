import type { ContentBlock } from "@genlayer-school/content";

export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="content-flow">
      {blocks.map((block, index) => {
        if (block.type === "heading") return <h2 key={index}>{block.text}</h2>;
        if (block.type === "paragraph") return <p key={index}>{block.text}</p>;
        if (block.type === "list") {
          return (
            <ul key={index}>
              {block.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          );
        }
        if (block.type === "callout") {
          return (
            <aside className="callout" key={index}>
              <h3>{block.title}</h3>
              <p>{block.text}</p>
            </aside>
          );
        }
        return (
          <pre className="code-block" key={index}>
            <code>{block.code}</code>
          </pre>
        );
      })}
    </div>
  );
}
