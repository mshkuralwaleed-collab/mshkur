export const MshkurLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={32}
    height={32}
    {...props}
  >
    <path
      fill="currentColor"
      d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z"
    />
    <path
      fill="currentColor"
      d="M176 80h-35.42l-4.25-22.3a8 8 0 0 0-15.7 2.94L116.58 80H80a8 8 0 0 0 0 16h32.33l-8.49 44.58a8 8 0 0 0 15.7 2.94L128.06 96H176a8 8 0 0 0 0-16Z"
    />
    <path
      fill="currentColor"
      d="m139.67 176l4.25 22.3a8 8 0 0 0 15.7-2.94L151.13 176H176a8 8 0 0 0 0-16h-28.06l8.49-44.58a8 8 0 1 0-15.7-2.94L132.33 160H80a8 8 0 0 0 0 16h59.67Z"
    />
  </svg>
);

export const PwaIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={512}
    height={512}
    {...props}
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#29ABE2', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#9C27B0', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="64" fill="#2B3035" />
    <path
      fill="url(#grad1)"
      d="M256 72 a 184 184 0 1 0 0.0001 0 Z"
    />
     <path
      fill="#2B3035"
      d="M256 96 a 160 160 0 1 0 0.0001 0 Z"
    />
    <g fill="white">
       <path
        d="M344 184h-35.42l-4.25-22.3a8 8 0 0 0-15.7 2.94L284.58 184H248a8 8 0 0 0 0 16h32.33l-8.49 44.58a8 8 0 0 0 15.7 2.94L296.06 200H344a8 8 0 0 0 0-16Z"
        transform="scale(1.2) translate(-42, -30)"
      />
      <path
        d="m307.67 280l4.25 22.3a8 8 0 0 0 15.7-2.94L319.13 280H344a8 8 0 0 0 0-16h-28.06l8.49-44.58a8 8 0 1 0-15.7-2.94L300.33 264H248a8 8 0 0 0 0 16h59.67Z"
        transform="scale(1.2) translate(-42, -30)"
      />
    </g>
  </svg>
);
