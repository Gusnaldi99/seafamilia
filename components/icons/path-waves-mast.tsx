import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgPathWavesMast = ({
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
    strokeWidth={1.3}
    viewBox="0 0 24 24"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M2.5 17q4.5-3.6 9 0c4.5 3.6 6 2.4 9 0m-18 4q4.5-3.6 9 0c4.5 3.6 6 2.4 9 0M12 3v9m0-9L6 8h12z" />
  </svg>
);
export default SvgPathWavesMast;
