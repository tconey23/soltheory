import useGlobalStore from "../../../business/useGlobalStore"
import { Stack } from "@mui/system"
import { ListItem, Typography } from "@mui/material"
import { useEffect, useState } from "react"

const Prompt = ({prompt, color}) => {
    const user = useGlobalStore((state) => state.user) 
    const setUser = useGlobalStore((state) => state.setUser)
    const session = useGlobalStore((state) => state.session)
    const setSession = useGlobalStore((state) => state.setSession)
    const userMeta = useGlobalStore((state) => state.userMeta)
    const setUserMeta = useGlobalStore((state) => state.setUserMeta)

    const [width, setWidth] = useState()


    return (
            <Stack
                userdata='21things prompt' 
                padding={1} 
                sx={{    
                    minHeight: '100%',
                    minWidth: '100%',
                    backgroundColor: color,
                    borderRadius: 2,
                    textAlign: 'center',
                    boxShadow: '0px 2px 6px rgba(0,0,0,0.15)',
                    fontSize: '0.9rem',
                    lineHeight: 1,
                    overflow: 'hidden',
                }} 
                alignItems={'center'} 
                justifyContent={'center'} 
                boxShadow={'1px 1px 7px 1px #0000007a'} 
                borderRadius={2} 
                height={'80px'} 
                maxWidth={'100%'}
                backgroundColor={color}
            >
                <Typography fontFamily={'Fredoka Regular'} sx={{textOverflow: 'ellipsis'}} textAlign={'center'} fontSize={'0.9rem'}>{prompt}</Typography>
            </Stack>
    )
}

export default Prompt