import { Stack, Button, Typography, ImageList, Table, TableHead, TableBody, TableContainer, TableRow, TableCell } from '@mui/material'
import { useState, useEffect } from 'react'
import useGlobalStore from '../../../business/useGlobalStore'
import Prompt from './Prompt'
import { useGlobalContext } from '../../../business/GlobalContext'

const Stage = ({ 
  stageNum,
  prompts,
  setPrompts,
  selections,
  setSelections,
  setCurrentStage,
  nextStage,
  maxSelect,
  currentColor,
  prevColor
}) => {
  const {screen} = useGlobalContext()
  const [displayPrompts, setDisplayPrompts] = useState([])
  const [width, setWidth] = useState('30%')
  const [height, setHeight] = useState('30%')

  useEffect(() =>{
    console.log(screen)
    if(screen.isMobile){
      setWidth('100%')
    }
    if(screen.isLandscape){
      setWidth('45%')
    }
    if(screen.isXs){
      setWidth('40%')
    }
    if(screen.isXs && screen.isPortrait && screen.isMobile && screen.isShort){
      setHeight('85%')
    }
    if(screen.isXs && screen.isPortrait && screen.isMobile && !screen.isShort){
      setHeight('100%')
      setWidth('100%')
    }
  }, [screen])

  
  useEffect(() => {
    const stageSelections = selections[stageNum] || []
    const newPromptSet = [...stageSelections]
    const ids = new Set(stageSelections.map(p => p.prompt))

    prompts.forEach(p => {
      if (p.color === prevColor && !ids.has(p.prompt)) {
        newPromptSet.push({ ...p })
      }
    })

    setDisplayPrompts(newPromptSet)
  }, [prompts, selections, stageNum, prevColor])

  const currentSelections = displayPrompts.filter(p => p.color === currentColor)
  const selectCount = currentSelections.length

  const handleSelect = (_, index) => {
    setDisplayPrompts((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p
        const isSelected = p.color === currentColor
        if (isSelected) return { ...p, color: prevColor }
        if (selectCount >= maxSelect) return p
        return { ...p, color: currentColor }
      })
    )
  }

  const handleNext = () => {
    const selected = displayPrompts.filter(p => p.color === currentColor)
    const retained = prompts.filter(p => ![prevColor, currentColor].includes(p.color))

    setSelections(prev => ({
      ...prev,
      [stageNum]: selected
    }))
    setPrompts([...selected, ...retained])
    setCurrentStage(nextStage)
  }

  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  };
  
  const rows = chunkArray(displayPrompts, 3);

  return (
    <Stack height="100%" width={'100%'} alignItems="center" sx={{ scale: screen.isXs ? 0.98 : 1, overflow: 'hidden' }}>
      <Stack direction="row" spacing={2} mt={0} justifyContent="space-around" width="100%" alignItems="center">
        <Stack userdata="stage wrapper" width="66%">
          <Typography>
            Select {maxSelect}: {selectCount}/{maxSelect}
          </Typography>
        </Stack>
        <Stack width="15%" >
          <Button variant="contained" onClick={() => setCurrentStage(stageNum - 1)}>Back</Button>
        </Stack>
        <Stack width="15%">
          {selectCount === maxSelect && <Button variant="contained" onClick={handleNext}>Next</Button>}
        </Stack>
      </Stack>
      <TableContainer sx={{height: height}}>
        <Table sx={{width: width, justifySelf: 'center'}}>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((p, colIndex) => {
                  const originalIndex = rowIndex * 3 + colIndex;
                  return (
                    <TableCell sx={{width: '33%', padding: 1, justifyItems: 'center'}} onClick={() => handleSelect(p, originalIndex)} key={colIndex}>
                      <Prompt prompt={p.prompt} color={p.color} />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

export default Stage;