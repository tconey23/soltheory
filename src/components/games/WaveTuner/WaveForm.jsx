import React, { useRef, useEffect, useState } from "react";
import { Stack, Typography, Slider } from "@mui/material";

const WaveForm = ({ leftFreq, rightFreq, width = 400, height = 100, isPlaying }) => {
  const canvasRef = useRef();
  const requestRef = useRef();
  const [zoom, setZoom] = useState(0.001)

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    let start = performance.now();

    function draw(now) {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(0, height / 2);

      // Left channel (blue)
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        let time = t + (x / width) * (2 / zoom)
        let y = isPlaying
          ? Math.sin(2 * Math.PI * leftFreq * time) * (height / 4)
          : 0;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "skyblue";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Right channel (orange)
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        let time = t + x / width * 2;
        let y = isPlaying
          ? Math.sin(2 * Math.PI * rightFreq * time) * (height / 4)
          : 0;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "hotpink";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();
      requestRef.current = requestAnimationFrame(draw);
    }

    requestRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(requestRef.current);
  }, [leftFreq, rightFreq, width, height, isPlaying, zoom]);

  return (
    <Stack alignItems="center" height={'100%'}>
        <Stack height={'50%'}>
            <Typography color="white">Zoom</Typography>
            <Slider
                min={0.1}
                max={4}
                step={0.1}
                value={zoom}
                onChange={(_, val) => setZoom(val)}
                sx={{ width: 120 }}
            />
        </Stack>
        <Stack height={'50%'}>
        <canvas
            ref={canvasRef}
            width={width}
            height={'100%'}
            style={{
                width,
                height: '100%',
                background: "black",
                borderRadius: 8,
                boxShadow: "0 2px 10px #0001",
            }}
            />
        </Stack>
    </Stack>
  );
};

export default WaveForm;
