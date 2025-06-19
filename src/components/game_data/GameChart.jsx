import { useEffect, useState, useRef } from 'react';
import { Stack, Typography } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const GameChart = ({data, userFav}) => {
  const [width, setWidth] = useState(500)
  const [height, setHeight] = useState(400)
  const parentContainer = useRef()

  console.log(data)

  const barHeight = 40;
  const chartHeight = Math.min(Math.max(data.length * barHeight, 150), 600)

  useEffect(() => {
    if(parentContainer?.current){
      setWidth(parentContainer?.current?.clientWidth)
      setHeight(parentContainer?.current?.clientHeight)
    }
  }, [parentContainer])

  const coloredData = data.map((item) => ({
  ...item,
  fill: item.label === userFav ? '#ff4081' : 'blue'
}));

  return (
    <Stack ref={parentContainer} direction={'column'} height='100%' width='100%' justifyContent='center' alignItems="center" sx={{scale: 0.90}} bgcolor={'white'} borderRadius={2}>
      {data?.length && 
      <ResponsiveContainer width={width} height={chartHeight}>
        <BarChart
          data={coloredData}
          layout="vertical"
          margin={{ top: 20, right: 25, left: 0, bottom: 5 }}
          barSize={10}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            domain={[0, (dataMax) => dataMax + 3]}
            tickCount={10}
            allowDecimals={false}
            tickFormatter={(value) => value}
          />
          <YAxis dataKey="label" type="category" width={width/2} tick={{ fontSize: 12 }}/>
          <Bar
            dataKey="value"
            isAnimationActive={false}
            shape={(props) => {
              const { x, y, width, height, payload } = props;
              const isFav = payload.label === userFav;
              return (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={payload.fill}
                    rx={2}
                  />
                  {isFav && (
                    <text
                      x={x + width + 10}
                      y={y + height / 2}
                      dy={4}
                      fontSize={14}
                      fontWeight={'bolder'}
                      fill="#ff4081"
                    >
                     ⭐ This is you!!
                    </text>
                  )}
                </g>
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>}
    </Stack>
  );
};

export default GameChart;