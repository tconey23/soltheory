import {
  Stack,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useState, useEffect, useMemo } from 'react'; 
import Prompt from './Prompt';


const SelectionHex = ({ selectCount, maxSelect, color }) => {
  const empty = (
    <i className="fi fi-rr-hexagon" style={{ margin: '0 5px', fontSize: '20px' }} />
  );
  const filled = (
    <i className="fi fi-sr-hexagon" style={{ margin: '0 5px', color: color, fontSize: '20px' }} />
  );

  const hexagons = useMemo(() => {
    const result = [];
    for (let i = 0; i < maxSelect; i++) {
      result.push(i < selectCount ? filled : empty);
    }
    return result;
  }, [selectCount, maxSelect]);

  return <>{hexagons}</>;
};

const Stage = ({
  stageNum,
  prompts,
  setPrompts,
  setCurrentStage,
  nextStage,
  maxSelect,
  currentColor,
  prevColor,
}) => {
  const [displayPrompts, setDisplayPrompts] = useState([]);
  const [width, setWidth] = useState('33%');
  const [height, setHeight] = useState('83%');

  // Show all prompts on stage 1, and prior+current for stages 2+
  useEffect(() => {
    if (stageNum === 1) {
      setDisplayPrompts(prompts);
    } else {
      const stageSelections = prompts.filter(
        (p) => p.stages.includes(stageNum) || p.stages.includes(stageNum - 1)
      );
      setDisplayPrompts(stageSelections);
    }
  }, [prompts, stageNum]);

  // How many are selected in the current stage
  const selectCount = displayPrompts.filter((p) =>
    p.stages.includes(stageNum)
  ).length;

  // Handle selection toggling
  const handleSelect = (_, index) => {
    const updated = displayPrompts.map((p, i) => {
      if (i !== index) return p;

      const isSelected = p.stages.includes(stageNum);
      if (isSelected) {
        // Deselect
        return { ...p, stages: p.stages.filter((n) => n !== stageNum) };
      }

      if (selectCount >= maxSelect) return p; // maxed out

      // Select
      return { ...p, stages: [...p.stages, stageNum] };
    });

    setDisplayPrompts(updated);
  };

  // Commit current stage selection into master prompts array
  const handleNext = () => {
    const updated = prompts.map((p) => {
      const match = displayPrompts.find((dp) => dp.prompt === p.prompt);
      return match ? { ...match } : p;
    });

    setPrompts(updated);
    setCurrentStage(nextStage);
  };

  // Split into rows of 3 prompts
  const chunkArray = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const rows = chunkArray(displayPrompts, 3);

  return (
    <Stack height="100%" width="100%" paddingTop={3} alignItems="center" sx={{ overflow: 'hidden' }}>
      <Stack
        height="5%"
        direction="row"
        spacing={2}
        mt={0}
        justifyContent="space-around"
        width="100%"
        alignItems="center"
        paddingBottom={2}
      >
        <Stack width="66%">
          <Typography>
            Select {maxSelect}| {<SelectionHex color={currentColor} maxSelect={maxSelect} selectCount={selectCount}/>}
          </Typography>
        </Stack>

        <Stack width="50%" direction={'row'} justifyContent={'space-evenly'}>
          <Button
            variant="contained"
            onClick={() => setCurrentStage(stageNum - 1)}
          >
            Back
          </Button>
          {selectCount === maxSelect && (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Stack>
      </Stack>

      <Box
  sx={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 2,
    width: '90%',
    maxWidth: '600px',
    maxHeight: '100%',
    padding: 0.5,
    margin: '0 auto',
    overflow: 'auto'
  }}
>
  {displayPrompts.map((p, i) => {
    const color = p.stages.includes(stageNum)
      ? currentColor
      : p.stages.includes(stageNum - 1)
      ? prevColor
      : 'white';

    return (
      <Box
        key={i}
        onClick={() => handleSelect(p, i)}
        sx={{
          backgroundColor: color,
          height: '140px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: 2,
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          padding: 1,
          fontSize: '1.1rem',
          lineHeight: 1,
          paddingX: 2
        }}
      >
        {p.prompt}
      </Box>
    );
  })}
</Box>

    </Stack>
  );
};

export default Stage;
