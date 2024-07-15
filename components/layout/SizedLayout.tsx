import React, { useRef, useEffect, useState, ReactNode } from "react";

interface SizedLayoutProps {
  children: (width: number) => ReactNode;
}

const SizedLayout: React.FC<SizedLayoutProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      {children(containerWidth)}
    </div>
  );
};

export default SizedLayout;
