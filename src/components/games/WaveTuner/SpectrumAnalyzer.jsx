import React, { useRef, useEffect } from "react";

const SpectrumAnalyzer = ({
  leftAnalyser,
  rightAnalyser,
  width = 400,
  height = 120,
  minFreq = 20,
  maxFreq = 200,
  leftColor = "#66ccff",   // sky blue
  rightColor = "#ff6fcb",  // pink
  showBars, 
  showSine
}) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!leftAnalyser || !rightAnalyser) return;
    const ctx = canvasRef.current.getContext("2d");

    // Assume both analysers have the same settings (true for most cases)
    const fftSize = leftAnalyser.fftSize;
    const sampleRate = leftAnalyser.context.sampleRate;
    const bufferLength = leftAnalyser.frequencyBinCount;

    // Frequency bin mapping
    const minBin = Math.floor((minFreq * fftSize) / sampleRate);
    const maxBin = Math.min(bufferLength - 1, Math.ceil((maxFreq * fftSize) / sampleRate));
    const binsToShow = maxBin - minBin + 1;
    const barWidth = width / binsToShow;

    const leftData = new Uint8Array(bufferLength);
    const rightData = new Uint8Array(bufferLength);

    let animationId;
    function draw() {
      leftAnalyser.getByteFrequencyData(leftData);
      rightAnalyser.getByteFrequencyData(rightData);

      ctx.clearRect(0, 0, width, height);

      if(showBars){

          for (let i = minBin; i <= maxBin; i++) {
              const barHeight = (leftData[i] / 255) * (height / 2.2);
              ctx.fillStyle = leftColor;
              ctx.globalAlpha = 0.5;
              ctx.fillRect(
                  (i - minBin) * barWidth,
                  height / 2,           // start at center
                  barWidth,
                  barHeight             // positive height, draws DOWN from center
                );
            }
            
            for (let i = minBin; i <= maxBin; i++) {
                const x = (i - minBin) * barWidth;
                const barHeight = (rightData[i] / 255) * (height / 2.2);
                ctx.fillStyle = rightColor;
                ctx.globalAlpha = 0.5;
                ctx.fillRect(
                    x,    // <--- FIXED X COORDINATE
                    height / 2,                 // start at center
                    barWidth,
                    -barHeight                  // negative height draws up from center
                );
            }
            ctx.globalAlpha = 1.0;
        }

        // Prepare
        const leftTimeData = new Uint8Array(bufferLength);
        leftAnalyser.getByteTimeDomainData(leftTimeData);
        const rightTimeData = new Uint8Array(bufferLength);
        rightAnalyser.getByteTimeDomainData(rightTimeData);

        if(showSine){
            // Draw left (bottom)
            ctx.save();
            ctx.strokeStyle = leftColor;
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2
            ctx.beginPath();
            for (let x = 0; x < width; x++) {
                const i = Math.floor((x / width) * bufferLength);
                const y = height / 2 + ((leftTimeData[i] - 128) / 128) * (height);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.restore();
            
            // Draw right (top)
            ctx.save();
            ctx.strokeStyle = rightColor;
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2
            ctx.beginPath();
            for (let x = 0; x < width; x++) {
                const i = Math.floor((x / width) * bufferLength);
                const y = height / 2 + ((rightTimeData[i] - 128) / 128) * (-height);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.restore();
        }

        animationId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [leftAnalyser, rightAnalyser, width, height, minFreq, maxFreq, leftColor, rightColor, showSine, showBars]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width,
        height,
        background: "black",
        borderRadius: 8,
        boxShadow: "0 2px 10px #0003",
      }}
    />
  );
};

export default SpectrumAnalyzer;
