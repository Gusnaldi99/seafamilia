import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgBoatMast = ({
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
    strokeWidth={1.5}
    viewBox="0 0 20 20"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <circle cx={10} cy={4.6} r={1.6} />
    <path d="M10 6.6V16m-4.8-5h-1m11.6 0h-1m-9.2.4c0 3 2 5.2 4.4 6.6m4.4-6.6c0 3-2 5.2-4.4 6.6" />
  </svg>
);
export default SvgBoatMast;
