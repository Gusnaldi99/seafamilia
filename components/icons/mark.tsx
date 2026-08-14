import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgMark = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeLinecap="square"
    strokeWidth={2.4}
    viewBox="0 0 100 104"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M7 86V47a43 43 0 0 1 86 0v39M7 86h86" />
    <path d="M24 44c4 9 5 19 3 27l13 2V46z" />
    <path d="M36 56h26v6H36zm-3 6h34v6H33zm0 6h34v6H33zM53 56V30M53 30 40 45c5-1 9 0 13 2" />
    <path d="m55 58 28 16H60M27 74h48l-6 9H33z" />
    <path
      strokeWidth={2.6}
      d="M22 92h14m4 0h22m4 0h6m4 0h6M32 98h7m4 0h12m4 0h16M45 104h14m4 0h5"
    />
  </svg>
);
export default SvgMark;
