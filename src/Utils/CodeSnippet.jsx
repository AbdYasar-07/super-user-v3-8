import "../Components/Styles/CodeSnippets.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

export const CodeSnippet = ({ title, code = "" }) => {

  return (
    <div className="code-snippet">
      <span className="code-snippet__title">{title}</span>
      <div className="code-snippet__container">
        <div className="code-snippet__wrapper p-0">
          <SyntaxHighlighter className="code-snippet__body" language="json" style={tomorrow}>
            {code}
          </SyntaxHighlighter>
          {/* <pre  dangerouslySetInnerHTML={{ __html: coloredString }} ></pre> */}
        </div>
      </div>
    </div>
  );
};
