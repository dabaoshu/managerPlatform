import { useState } from 'react';

export const useHoverClick = () => {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const hide = () => {
    setClicked(false);
    setHovered(false);
  };

  const handleHoverChange = (open: boolean) => {
    if (!clicked) {
      setHovered(open);
      setClicked(false);
    }
  };

  const handleClickChange = (open: boolean) => {
    setHovered(false);
    setClicked(open);
  };
  return {
    clicked,
    hovered,
    hide,
    handleHoverChange,
    handleClickChange,
  };
};
