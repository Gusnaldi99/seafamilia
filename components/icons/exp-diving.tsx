import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgExpDiving = ({
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
    <path d="M2.6 12c3-4.2 7.2-6.2 11.2-6.2 2.9 0 5 1.4 6.1 2.9L17.2 12l2.7 3.3c-1.1 1.5-3.2 2.9-6.1 2.9-4 0-8.2-2-11.2-6.2" />
    <circle cx={9} cy={10.6} r={0.9} fill="currentColor" stroke="none" />
  </svg>
);
export default SvgExpDiving;
