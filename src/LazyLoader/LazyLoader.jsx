import { useEffect, useRef, useState } from "react";

const LazyLoader = ({ src, alt, className = "", onClick }) => {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          imgRef.current.src = src;
          observer.unobserve(imgRef.current);
        }
      },
      { threshold: 0.2 }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      data-src={src}
      alt={alt}
      onClick={onClick}     // ✅ ADD THIS
      onLoad={() => setLoaded(true)}
      className={`cursor-pointer transition-all duration-300 ${
        loaded ? "blur-0 opacity-100" : "blur-md opacity-60"
      } ${className}`}
    />
  );
};

export default LazyLoader;
