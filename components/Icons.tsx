import React from 'react';

export const ReactIcon = ({className}: {className?: string}) => (
  <svg viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="0" cy="0" r="2" fill="currentColor"/>
    <g stroke="currentColor" strokeWidth="1" fill="none">
      <ellipse rx="10" ry="4.5"/>
      <ellipse rx="10" ry="4.5" transform="rotate(60)"/>
      <ellipse rx="10" ry="4.5" transform="rotate(120)"/>
    </g>
  </svg>
);

export const NextjsIcon = ({className}: {className?: string}) => (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <mask id="mask0_next" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
      <circle cx="90" cy="90" r="90" fill="currentColor"/>
    </mask>
    <g mask="url(#mask0_next)">
      <circle cx="90" cy="90" r="90" fill="currentColor" stroke="none" />
      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="var(--bg-color, white)"/>
      <rect x="115" y="54" width="12" height="72" fill="var(--bg-color, white)"/>
    </g>
  </svg>
);

export const TypeScriptIcon = ({className}: {className?: string}) => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <rect width="128" height="128" rx="20" fill="currentColor"/>
      <path d="M99.5,70.6c-12.8,0-19.1,6.1-20.9,13.8l-0.5,2.1h15.2l0.2-1.1 c0.7-3.7,3.1-6,7.5-6c4,0,6.5,2.1,6.5,5.2c0,3-1.6,4.5-9.1,7.2c-10.4,3.7-15.3,8.4-15.3,16.5c0,9.3,7.5,15.6,18.8,15.6 c12.8,0,20.1-6.1,21.9-14.7l0.4-2h-15.2l-0.2,1.2c-0.6,3.6-3.3,6-7.8,6c-4.3,0-6.6-2.2-6.6-5.4c0-3.3,1.8-4.9,9.4-7.6 c10.3-3.7,15-8.5,15-16.1C121.7,75.8,111.9,70.6,99.5,70.6z M57.3,72.4h-16v12.6H27v13.3h14.3v29.4h16V72.4z" fill="white"/>
    </g>
  </svg>
);

export const JavaScriptIcon = ({className}: {className?: string}) => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="128" height="128" rx="20" fill="currentColor"/>
    <path d="M88.1,91.8c-3.9,0-6.9-1.9-8.4-5.4l-14.2,9c3.9,6.7,11.2,10.9,19.9,10.9c16.3,0,26.5-9.3,26.5-24.3 V45.2H96.9v35c0,6.6-3.6,11.6-8.8,11.6L88.1,91.8z M50.4,106.3c15.2,0,24.1-7.2,24.1-18c0-8.6-6-13.6-18.7-18.9 l-3.1-1.3c-5.7-2.3-7.5-4.4-7.5-7.7c0-4.1,3.2-6.9,8.4-6.9c5.1,0,8.3,2.4,10.1,6.8l13.5-8.6C73.4,45.4,65.3,40,53.8,40 c-15.4,0-23.8,8.2-23.8,18.8c0,9.3,6,14.2,19.3,19.7l2.8,1.2c6.9,2.9,8.5,5.1,8.5,8.8c0,4.6-3.8,7.3-9.4,7.3 c-6.4,0-10.8-3.1-12.7-8.9l-14,9C28.4,102.5,36.5,106.3,50.4,106.3z" fill="black"/>
  </svg>
);

export const ViteIcon = ({className}: {className?: string}) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M30.6 2.7c.3-.6.1-1.3-.5-1.5-.2-.1-.4-.1-.6 0L17.7 5.9c-.4.2-.6.6-.5 1l3.5 13.9c.1.4 0 .9-.4 1.1-.4.2-.9 0-1.1-.4L17.6 15c-.1-.4-.5-.7-1-.6-.4.1-.7.5-.6 1l2.4 9.6c.1.5-.1 1-.5 1.3-.4.3-.9.2-1.3-.1l-7.2-6.5c-.3-.3-.4-.8-.2-1.2l6.8-13.8c.2-.4.1-.9-.3-1.1-.4-.2-.9-.1-1.1.3L8.8 17.5c-.2.4-.7.6-1.1.4-.4-.2-.6-.7-.4-1.1l7.6-15.3c.3-.6 0-1.3-.6-1.5-.2-.1-.5 0-.7.1L1.4 8.6C.8 8.9.5 9.6.7 10.2l13.9 21.3c.3.4.7.7 1.2.7s.9-.3 1.2-.7l13.6-28.8z" fill="currentColor"/>
  </svg>
);

export const PythonIcon = ({className}: {className?: string}) => (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className={className}>
    <path d="M126.916.072c-24.804-.897-47.676 10.666-64.408 26.654 3.792-.06 7.575-.123 11.354-.15 20.442-.144 42.748 3.57 43.613 28.48l.05 19.845H52.512c-27.144-.047-38.385 14.288-39.066 38.358-.696 24.606.335 45.41 24.464 47.96 0 3.792-.016 7.587-.074 11.378-.445 28.58 20.573 43.14 47.16 43.432 26.586.292 51.527-11.45 68.324-28.006-3.834.072-7.669.148-11.5.19-19.9-10.37-23.778-36.21-8.485-53.766 11.022-12.645 23.32-15.688 39.462-16.143 3.84-.108 7.687-.044 11.53-.024z" fill="currentColor"/>
    <path d="M128.613 255.95c24.79.914 47.676-10.665 64.394-26.666-3.792.062-7.576.124-11.355.15-20.442.155-42.747-3.559-43.601-28.468l-.048-19.846h65.04c27.145.048 38.385-14.287 39.055-38.357.696-24.606-.324-45.41-24.453-47.96-1.124-.12-2.396-.06-3.792-.01-3.792.01-7.586.06-11.378.435-28.59-20.572-43.14-47.16-43.432-26.587-.3-51.528 11.45-68.325 28.007 3.846-.073 7.682-.149 11.512-.192 19.9 0 32.534 8.784 37.625 29.837 3.996 16.533 1.156 31.79-8.485 53.765-11.022 12.646-23.32 15.69-39.462 16.144-3.84.108-7.687.043-11.53.023z" fill="#FFF"/>
  </svg>
);