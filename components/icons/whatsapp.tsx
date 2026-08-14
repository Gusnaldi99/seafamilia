import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgWhatsapp = ({
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
    <path d="M17 9.5c0 3.4-3.1 6.2-7 6.2-.8 0-1.6-.1-2.3-.3L4 17l1-2.7a6 6 0 0 1-2-4.8c0-3.4 3.1-6.2 7-6.2s7 2.8 7 6.2" />
  </svg>
);
export default SvgWhatsapp;
