import { Stack, Typography} from '@mui/material'
import React from 'react'
import Hexagon from '../Hexagon'

const Info = () => {
  return (
    <Stack height={'90%'} width={'100%'} alignItems={'center'} justifyContent={'flex-start'}>
        
        <Stack alignItems={'center'}>
        <Typography fontFamily={'fredoka regular'} fontSize={25}>
            Welcome to 21 Things!
        </Typography>

        <Typography marginTop={-1} fontFamily={'fredoka regular'} fontSize={14}>
            A SOL Theory game
        </Typography>

          <Hexagon dims={100}/>
        </Stack>

        <Stack width={'90%'} height={'76%'} overflow={'auto'}>
            <Stack my={2} height={'20%'}>
                <Typography fontFamily={'fredoka regular'} fontSize={18}>
                    21 Things Is A Daily Game of Discovery, Joy, and Reflection
                </Typography>
            </Stack>

            <Stack my={2} height={'20%'}>
                <Typography fontFamily={'fredoka regular'} fontSize={15}>
                    Every day, 21 Things presents you with a fresh set of 21 items—ideas, objects, people, places, memories, dreams, or inspirations.
                </Typography>
            </Stack>

            <Stack my={2} height={'20%'}>
                <Typography fontFamily={'fredoka regular'} fontSize={18}>
                    🌀 Stage 1: Choose 6 Things You Love:
                </Typography>
            </Stack>

            <Stack my={0} height={'20%'}>               
                <Typography fontFamily={'fredoka regular'} fontSize={15}>
                    From the list of 21, select the six that resonate with you most—things that spark joy, bring you comfort, or simply make you smile.
                </Typography>
            </Stack>

            <Stack my={2} height={'20%'}>
                <Typography fontFamily={'fredoka regular'} fontSize={18}>
                    💫 Stage 2: Narrow It Down to 3:
                </Typography>
            </Stack>

            <Stack my={0} height={'20%'}>               
                <Typography fontFamily={'fredoka regular'} fontSize={15}>
                    From the list of 21, select the six that resonate with you most—things that spark joy, bring you comfort, or simply make you smile.
                </Typography>
            </Stack>

            <Stack my={2} height={'20%'}>
                <Typography fontFamily={'fredoka regular'} fontSize={18}>
                    🌈 Stage 3: Pick Your One Favorite:
                </Typography>
            </Stack>

            <Stack my={0} height={'20%'}>                
                <Typography fontFamily={'fredoka regular'} fontSize={15}>
                   Finally, choose the one thing that stands out above the rest—the thing that matters most to you today.
                </Typography>
            </Stack>

            <Stack my={2} height={'20%'}>
                <Typography fontFamily={'fredoka regular'} fontSize={18}>
                    ✍️ Reflect & Share:
                </Typography>
            </Stack>

            <Stack my={0} height={'20%'}>               
                <Typography fontFamily={'fredoka regular'} fontSize={15}>
                   Write a few words about why you chose your favorite. This could be a memory, a feeling, or an intention. You can save your entry privately, or share it with a friend.
                </Typography>
            </Stack>

        </Stack>

    </Stack>
  )
}

export default Info
