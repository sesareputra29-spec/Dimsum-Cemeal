import React from "react";
import { FormattedPart } from "../types/cms.ts";

interface RichTextRendererProps {
  parts?: FormattedPart[];
  fallbackText?: string;
  className?: string;
  defaultColor?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  parts,
  fallbackText,
  className = "",
  defaultColor,
}) => {
  if (!parts || parts.length === 0) {
    return <span className={className} style={{ color: defaultColor }}>{fallbackText}</span>;
  }

  return (
    <span className={className}>
      {parts.map((part) => {
        const style: React.CSSProperties = {};
        if (part.color) style.color = part.color;
        if (part.font) style.fontFamily = part.font;
        if (part.fontSize) style.fontSize = part.fontSize;
        if (part.fontWeight) style.fontWeight = part.fontWeight;
        if (part.italic) style.fontStyle = "italic";
        if (part.underline) style.textDecoration = "underline";

        return (
          <span key={part.id} style={style}>
            {part.text}
          </span>
        );
      })}
    </span>
  );
};
