import clsx from 'clsx';

export default function LogoIconhorizontal(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`${process.env.SITE_NAME} logo`}
      viewBox="0 0 459.77 141.22"
      {...props}
      className={clsx('w-full transition-transform duration-300 hover:scale-102', props.className)}
    >
      {/* Text elements - only these should change color in dark mode */}
      <g className="animate-fadeIn fill-[#424243] dark:fill-white">
        <path d="M165,50.04c-1.22-4.07-6.07-1.1-5.78-3.84l14.45-6.76.49,9.14c7.27-15.71,31.55-14.8,38.55.96,13.85-22.31,42.89-10.04,42.89,8.21v39.52c0,2.34,4.81,4.51,7.22,4.35v1.91s-24.08,0-24.08,0v-1.92c3.01.47,7.23-2.52,7.23-3.38v-41.44c0-2.65-5.01-12.44-8.75-14.38-12.96-6.7-22.09,6.66-22.09,9.56v46.26c0,2.74,9.41,3.15,8.19,5.3h-25.06v-1.92c3.11.58,7.23-2.48,7.23-4.35v-41.44c0-10.02-18.79-24.96-28.67-7.47-4.96,8.78-4.04,47.7-1.23,50.86,1.65,1.85,3.88,2.45,6.28,2.4v1.92s-25.05,0-25.05,0v-1.92c3.33.26,8.19-1.58,8.19-5.31,0-7.2.66-44.05,0-46.26Z" />
        <path d="M39.51,13.21c14.07-1.38,29,2.86,38.65,13.53l-9.05,12.21c.68-9.12-15.11-19.08-23.43-20.92C-3.1,7.28-1.34,88.44,45.06,101.55c33.46,9.45,44.51-24.84,35.96-35.96-3.26-4.24-20.06-6.49-2.44-7,1.74-.05,13.72.52,14.1,1.12,2.62,41.69-42.71,62.2-74.63,36.08C-14.97,68.77.33,17.07,39.51,13.21Z" />
        <path d="M323.07,123.29c.34,1.21,4.66,4.83,7.72,4.8l.46,2.42-25.54-.49c-1.2-2.09,6.46-1.48,7.68-6.76,1.41-6.07,1.24-54.05.2-67.24,12.86-25.39,48.25-24.08,60-.62,16.68,33.28-22.35,66.12-50.54,39.94.67,7.64-.92,24.7,0,27.95ZM335.39,41.11c-5.15.49-10.22,3.83-13.06,8.08-3.27,72.77,57.15,62.29,44.4,16.95-3.47-12.35-17.65-26.33-31.34-25.03Z" />
        <path d="M121.4,38.24c33.07-5.08,48.35,32.33,16.88,42.91-25.56,8.59-35.03-14.46-31.32-1.98,6.64,22.36,39.74,28.7,51.78,7.03,5.69-.35-16.19,29.17-45.13,14.27-28.31-14.57-20.97-57.81,7.79-62.23ZM124.33,40.14c-25.92,1.15-26.44,44.19,6.34,40.15,25.02-3.08,16.77-41.18-6.34-40.15Z" />
        <path d="M406.44,37.99c3.19,0,6.46-.17,9.64,0,1.59.09,3.22,0,4.82,0,4.77,0,23.63,10.48,20.66,27.41-1.79,10.23-22.58,22.74-39.46,15.48-7.6-3.27-14.03-15.04-8.55-1.09,5.92,15.07,22.28,23.97,38.14,18.14,8.86-3.25,12.64-13.48,14.75-10.3-21.18,33.66-73.03,13.35-63.14-26.52,3.33-13.42,18.17-23.12,23.14-23.12ZM410.59,40.14c-25.94,1.2-25.88,44.11,6.34,40.15,25.54-3.14,16.88-41.22-6.34-40.15Z" />
        <path d="M264.27,79.92h1.92c4.77,33.75,45.68,24.17,32.23,3.44-6.48-9.98-46.16-15.62-29.32-38.13,7.88-10.53,24.18-7.89,34.69-3.86v15.42h-1.91c-3.37-21.28-29.68-19.51-30.55-7.58-1.19,16.31,40.17,16.24,36.25,40.29-3.76,23.05-43.31,13.65-43.31,7.77v-17.35Z" />
      </g>

      {/* Leaf decorative elements with floating animation */}
      <g className="animate-float">
        <path
          fill="#5e9955"
          className="animate-float-delay-1"
          d="M182.55,23.32c14.87,3.2,21.72,11.57,26.5,25.53-20.87-.95-29.31-23.97-26.5-25.53Z"
        />
        <polygon
          fill="#2d793c"
          className="animate-float-delay-2"
          points="209.7 49.61 180.72 21.54 184.29 34.83 193.59 44.46 208.79 50.35 209.7 49.61"
        />
        <path
          fill="#5e9955"
          className="animate-float-delay-3"
          d="M241.37,23.32c-.35,13.24-13.64,24.95-26.51,25.52,3.68-14.12,11.91-22.97,26.51-25.52Z"
        />
        <polygon
          fill="#2d793c"
          className="animate-float-delay-4"
          points="214.31 49.61 243.29 21.54 239.72 34.83 230.42 44.46 215.23 50.35 214.31 49.61"
        />
      </g>

      {/* Top decorative elements with gentle pulse animation */}
      <g className="animate-pulse-slow">
        <path
          fill="#2d793c"
          d="M220.4.81c-6.51,7.04-11.17,6.56-17.77,0,2.9-1.07,14.87-1.08,17.77,0Z"
        />
        <path
          fill="#539644"
          d="M220.4.81c.96.36,9.5,7.01,9.52,7.61-2.4,1.02-10.84.61-11.97,1.67-1.33,1.26-2.15,17.72-7.07,21.17-6.41-6.15-11.53-15.57-17.04-22.64-.04-1.02,7.65-7.4,8.79-7.82,6.59,6.56,11.25,7.04,17.77,0Z"
        />
        <path
          fill="#29753a"
          d="M202.5,9.24c.99-.08,3.22-.71,3.88.19.54.74,3.17,15.52,3.56,18.01-2.93-6.27-6.6-12.19-11.1-17.45.13-.23,3.05-.71,3.66-.76Z"
        />
        <polygon fill="#2d793c" points="198.84 10 206.7 8.42 209.87 27.07 198.84 10" />
        <polyline fill="#2d793c" points="217.83 7.79 229.92 8.32 211.84 33.06 210.88 31.17" />
      </g>
    </svg>
  );
}