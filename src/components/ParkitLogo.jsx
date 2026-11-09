import React, { useState } from "react";
import defaultLogoAsset from "../assets/logo.png";

export default function ParkitLogo({
  className = "w-full h-full object-contain",
  customSrc = null
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const targetSrc = customSrc || defaultLogoAsset;

  if (targetSrc && !imgFailed) {
    return (
      <img
        src={targetSrc}
        alt="PARKIT"
        className={className}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-label="PARKIT Logo"
    >
      <defs>
        <linearGradient id="parkitPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0752B5" />
          <stop offset="100%" stopColor="#35B5F6" />
        </linearGradient>
        <linearGradient id="parkitGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#75D84C" />
          <stop offset="100%" stopColor="#55B82C" />
        </linearGradient>
      </defs>
      <path
        d="M50 8C31.2 8 16 23.2 16 42C16 63 46 90 48.5 92.2C49.4 93 50.6 93 51.5 92.2C54 90 84 63 84 42C84 23.2 68.8 8 50 8Z"
        fill="url(#parkitPinGrad)"
      />
      <circle cx="50" cy="38" r="26" fill="#FFFFFF" opacity="0.98" />
      <path
        d="M42 22H53C58.5 22 63 26.5 63 32C63 37.5 58.5 42 53 42H48V54H42V22ZM48 36.5H52.5C55 36.5 57 34.5 57 32C57 29.5 55 27.5 52.5 27.5H48V36.5Z"
        fill="#0752B5"
      />
      <circle cx="50" cy="80" r="4.5" fill="url(#parkitGreenGrad)" />
      <circle cx="68" cy="24" r="6" fill="#75D84C" />
    </svg>
  );
}

