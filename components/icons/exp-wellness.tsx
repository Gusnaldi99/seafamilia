import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgExpWellness = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.4}
    viewBox="0 0 24 24"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <circle cx={12} cy={8.6} r={3.4} />
    <path d="M12 2.2V4M4.8 8.6H3m18 0h-1.8M6.9 3.5 5.6 2.2m11.5 1.3 1.3-1.3M3 18q4.5-3 9 0c4.5 3 6 2 9 0" />
  </svg>
);
export default SvgExpWellness;
