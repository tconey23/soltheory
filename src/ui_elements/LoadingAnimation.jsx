import { useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";

const colors = ['#dd95ff', "#fffb00", "#8be453", '#dd95ff'];
const circleCount = colors.length;
const baseY = 50;     // Middle y position
const amplitude = 12; // How far up/down the bounce goes
const speed = 1;      // Animation speed

const LoadingAnimation = () => {
  const [time, setTime] = useState(0);
  const [radius, setRadius] = useState(15)
  const rafRef = useRef();

  useEffect(() => {
    const animate = () => {
      setTime((t) => t + 0.05);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <Stack direction="column" width="100%" height="100%" alignItems="center" justifyContent="center">
      <svg
        width={'100%'}
        height={'100%'}
        viewBox={`${radius *2} 0 100 100`}
        style={{ shapeRendering: "auto", display: "block", background: "rgba(255, 255, 255, 0)", overflow: 'visible'}}
      >
        {colors.map((color, i) => {
          // Animate each dot's y position with a phase delay
          const phase = (i / circleCount) * Math.PI * 2;
          const cy = baseY + Math.sin(time * speed + phase) * amplitude;
          const cx = 36 + i * (radius*2);
          return (
            <circle key={i} fill={color} r={radius} cx={cx} cy={cy} />
          );
        })}
      </svg>
    </Stack>
  );
};

export default LoadingAnimation;
