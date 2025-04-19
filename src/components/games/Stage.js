import { Stack, Button, Typography, ImageList } from '@mui/material'
import { useState, useEffect } from 'react'
import { useGlobalContext } from '../../business/GlobalContext'
import Prompt from './Prompt'

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
  const { isMobile } = useGlobalContext()
  const [displayPrompts, setDisplayPrompts] = useState([])

  
  useEffect(() => {
    console.log(prompts)
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

  return (
    <Stack height="100%" width="95%" alignItems="center" sx={{ scale: isMobile ? 0.95 : 1 }}>
      <Stack direction="row" spacing={2} mt={0} justifyContent="space-around" width="100%" alignItems="center">
        <Stack width="66%" sx={{ scale: isMobile ? 0.8 : 1 }}>
          <Typography>
            Select {maxSelect}: {selectCount}/{maxSelect}
          </Typography>
        </Stack>
        <Stack width="15%" sx={{ scale: isMobile ? 0.8 : 1 }}>
          <Button variant="contained" onClick={() => setCurrentStage(stageNum - 1)}>Back</Button>
        </Stack>
        <Stack width="15%" sx={{ scale: isMobile ? 0.8 : 1 }}>
          {selectCount === maxSelect && <Button variant="contained" onClick={handleNext}>Next</Button>}
        </Stack>
      </Stack>
      <ImageList sx={{ width: '100%', height: '100%' }} cols={3} rowHeight={100} gap={0}>
        {displayPrompts.map((p, i) => (
          <Stack justifyContent="center" key={i} onClick={() => handleSelect(p, i)}>
            <Prompt prompt={p.prompt} color={p.color} />
          </Stack>
        ))}
      </ImageList>
    </Stack>
  )
}

export default Stage;