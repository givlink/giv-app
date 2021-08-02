import React from "react";
const SafeImage = ({
  src,
  alt = "",
  fallbackSrc = "/icons/tama_def_sleepy.png",
  className = "h-32 w-32 shadow-xl object-cover rounded-xl",
  classNameFallback = "w-24 animate-wobble-slow opacity-25",
}) => {
  const [err, setError] = React.useState(false);
  const handleErr = (e) => setError(true);
  if (err && !fallbackSrc) return null;
  return (
    <img
      onError={handleErr}
      alt={alt}
      src={err ? fallbackSrc : src}
      className={`${err ? classNameFallback : className}`}
    />
  );
};
export default SafeImage;
