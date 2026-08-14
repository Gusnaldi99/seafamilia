import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgLink = ({
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
    strokeWidth={1.6}
    viewBox="0 0 20 20"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M8.5 11.5a3 3 0 0 0 4.2 0l2.8-2.8a3 3 0 1 0-4.2-4.2l-1.3 1" />
    <path d="M11.5 8.5a3 3 0 0 0-4.2 0l-2.8 2.8a3 3 0 1 0 4.2 4.2l1.3-1" />
  </svg>
);
export default SvgLink;
