import { useRef, useEffect } from "react";

export const useRenderCount = () => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`Render count: ${renderCount.current}`);
  });

  return renderCount.current;
};
