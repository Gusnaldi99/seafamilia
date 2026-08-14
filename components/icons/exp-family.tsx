import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgExpFamily = ({
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
    <circle cx={8.4} cy={6.8} r={2.7} />
    <circle cx={16.4} cy={9} r={2.1} />
    <path d="M3.6 20.2c0-3 2.1-5.2 4.8-5.2s4.8 2.2 4.8 5.2M13.3 20.2c0-2.4 1.4-4.1 3.1-4.1s3.1 1.7 3.1 4.1" />
  </svg>
);
export default SvgExpFamily;
