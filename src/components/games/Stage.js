// Stage.js
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
  const [displayPrompts, setDisplayPrompts] = useState([])
  const [selectCount, setSelectCount] = useState(0)
  const { isMobile } = useGlobalContext()

  useEffect(() => {
    if (selections[stageNum]?.length > 0) {
      setDisplayPrompts([
        ...selections[stageNum],
        ...prompts.filter((p) => p.color === prevColor)
      ])
      setSelectCount(selections[stageNum].length)
    } else {
      setDisplayPrompts(prompts.filter((p) => p.color === prevColor))
    }
  }, [prompts])

  const handleSelect = (_, index) => {
    setDisplayPrompts((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p
        if (p.color === currentColor) {
          setSelectCount((c) => c - 1)
          return { ...p, color: prevColor }
        }
        if (selectCount >= maxSelect) return p
        setSelectCount((c) => c + 1)
        return { ...p, color: currentColor }
      })
    )
  }

  const handleNext = () => {
    setSelections((prev) => ({
      ...prev,
      [stageNum]: displayPrompts.filter((p) => p.color === currentColor)
    }))
    setPrompts([
      ...displayPrompts,
      ...prompts.filter((p) => ![prevColor, currentColor].includes(p.color))
    ])
    setCurrentStage(nextStage)
  }

  return (
    <Stack userData='stage_comp' height={'100%'} width={'95%'} alignItems="center" sx={{scale: isMobile ? 0.95 : 1}}>
      <Stack direction="row" spacing={2} mt={0} justifyContent={'space-around'} width={'100%'} alignItems={'center'}>
        <Stack width={'66%'} sx={{scale: isMobile ? 0.8 : 1}}>
            <Typography variant="h10">
                Select {maxSelect}: {selectCount}/{maxSelect}
            </Typography>
        </Stack>
        <Stack width={'15%'} sx={{scale: isMobile ? 0.8 : 1}} >
            <Button variant='contained' onClick={() => setCurrentStage(stageNum - 1)}>Back</Button>
        </Stack>
        <Stack width={'15%'} sx={{scale: isMobile ? 0.8 : 1}}>
            {selectCount === maxSelect && <Button variant="contained" onClick={handleNext}>Next</Button>}
        </Stack>
      </Stack>
      <ImageList userData='prompt_list' sx={{ width: '100%', height: '100%', justifyItems: 'center', alignContent: 'space-between'}} cols={3} rowHeight={100} gap={'0px'}>
        {displayPrompts.map((p, i) => (
          <Stack justifyContent={'center'} key={i} onClick={() => handleSelect(p, i)}>
            <Prompt prompt={p.prompt} color={p.color} />
          </Stack>
        ))}
      </ImageList>
    </Stack>
  )
}

export default Stage
