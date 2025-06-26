import React, { useRef, useEffect, useState } from 'react';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { ParentSize } from '@visx/responsive';
import { Stack, Typography } from '@mui/material';


const GameChart = ({ data, userFav }) => {
  const [chartType, setChartType] = useState()


  const margin = { top: 20, right: 10, bottom: 40, left: chartType === '6pics' ? 10 : 120 };
  const barHeight = chartType === '6pics' ? 10 : 60;
  const maxChartHeight = 700;


  // console.log(data)

  useEffect(() => {
    if(isNaN(data?.[0]?.label)){
      setChartType('21things')
    } else {
      setChartType('6pics')
    }
  }, [data])

  const coloredData = data.map((item) => ({
    ...item,
    fill: item.label === userFav ? '#ff4081' : 'blue',
  }));

  return (
    <Stack width="100%" height="100%" justifyContent="center" alignItems="center" bgcolor="white" borderRadius={2}>
      {chartType === '6pics' && 
      <>
        <Typography>Top Scores</Typography>
        <Typography>⭐ = your score</Typography>
      </>
      }
      <ParentSize>
        {({ width, height }) => {
          const chartHeight = Math.min(Math.max(coloredData.length * barHeight, 300), maxChartHeight);

          // Scales
          const yScale = scaleBand({
            domain: coloredData.map((d) => d.label),
            range: [margin.top, chartHeight - margin.bottom],
            padding: 0.2,
          });

          const xMax = Math.max(...coloredData.map((d) => d.value));
          const roundedMax = Math.ceil(xMax * 1.1);
          const xScale = scaleLinear({
            domain: [0, roundedMax],
            range: [margin.left, width - margin.right],
          });

          return (
            <svg width={width} height={chartHeight}>
              <Group>
                {coloredData.map((d, i) => {
                  const barY = yScale(d.label);
                  const barX = xScale(0);
                  const barWidth = xScale(d.value) - barX;
                  const isFav = d.label === userFav;

                  return (
                    <Group key={`bar-${i}`}>
                      <Bar
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={yScale.bandwidth()}
                        fill={d.fill}
                        rx={4}
                      />
                      {isFav && (
                        <text
                          x={barX + barWidth + 10}
                          y={barY + yScale.bandwidth() / 2}
                          dy={4}
                          fontSize={14}
                          fontWeight="bold"
                          fill="#ff4081"
                        >
                          ⭐
                        </text>
                      )}
                    </Group>
                  );
                })}
              </Group>

              {/* Axes */}
              {chartType === '21things' && <AxisLeft
                left={margin.left}
                scale={yScale}
                // hideAxisLine
                tickComponent={({ formattedValue, ...tickProps }) => {
                  const wrapText = (text, maxCharsPerLine = 18) => {
                    const words = text.split(' ');
                    const lines = [];
                    let line = '';

                    for (const word of words) {
                      if ((line + ' ' + word).trim().length > maxCharsPerLine) {
                        lines.push(line.trim());
                        line = word;
                      } else {
                        line += ' ' + word;
                      }
                    }
                    lines.push(line.trim());
                    return lines;
                  };

                  const lines = wrapText(formattedValue);

                  return (
                    <text
                      {...tickProps}
                      fontSize={12}
                      fill="#333"
                      textAnchor="end"
                      dy="0.32em"
                    >
                      {lines.map((line, i) => (
                        <tspan key={i} x={tickProps.x} dy={i === 0 ? 0 : '1.2em'}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  );
                }}
              />}
              <AxisBottom
                top={chartHeight - margin.bottom}
                scale={xScale}
                numTicks={5} // ← Key fix: limits to 5 ticks
                tickFormat={(v) => v}
                tickLabelProps={() => ({
                  fontSize: 12,
                  fill: '#333',
                  textAnchor: 'middle',
                })}
              />
            </svg>
          );
        }}
      </ParentSize>
    </Stack>
  );
};

export default GameChart;
