import type { SVGProps } from 'react';

export function KioskConnectLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
      <path d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
      <path d="M12 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
      <path d="M12 18.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
      <path d="M12 5.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
      <path d="M8 12h8" />
    </svg>
  );
}
