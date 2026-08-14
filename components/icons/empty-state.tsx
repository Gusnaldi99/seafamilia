import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgEmptyState = ({
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
    viewBox="0 0 48 48"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M4 30q9-7.5 18 0c9 7.5 12 5 18 0M4 38q9-7.5 18 0c9 7.5 12 5 18 0" />
    <circle cx={21} cy={16} r={9} />
    <path d="m28 23 7 7" />
  </svg>
);
export default SvgEmptyState;
