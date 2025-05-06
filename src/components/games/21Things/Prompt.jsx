import useGlobalStore from "../../../business/useGlobalStore"
import { Stack } from "@mui/system"
import { ListItem, Typography } from "@mui/material"
import { useGlobalContext } from "../../../business/GlobalContext"
import { useEffect, useState } from "react"

const Prompt = ({prompt, color}) => {
    const {screen} = useGlobalContext()
    const user = useGlobalStore((state) => state.user)
    const setUser = useGlobalStore((state) => state.setUser)
    const session = useGlobalStore((state) => state.session)
    const setSession = useGlobalStore((state) => state.setSession)
    const userMeta = useGlobalStore((state) => state.userMeta)
    const setUserMeta = useGlobalStore((state) => state.setUserMeta)

    const [width, setWidth] = useState()

    useEffect(() => {
        if(screen.isMobile){setWidth('100%')}
        if(screen.isLandScape){setWidth('75%')}
    }, [])

    return (
            <Stack
                userdata='21things prompt' 
                padding={screen.isMobile ? '18px' :1} 
                sx={{minWidth: '90%', transition: 'all 0.25s ease-in-out', '&:hover': {cursor: 'pointer', scale: 1.05}, marginTop: '4px', marginBottom: '5px', marginLeft: '5px', marginRight: '5px'}} 
                alignItems={'center'} 
                justifyContent={'center'} 
                boxShadow={'1px 1px 7px 1px #0000007a'} 
                borderRadius={2} 
                width={width} height={'80px'} 
                maxWidth={'100%'}
                backgroundColor={color}
            >
                <Typography fontFamily={'Fredoka Regular'} sx={{textOverflow: 'ellipsis'}} textAlign={'center'} fontSize={screen.isMobile ? 11 : 15}>{prompt}</Typography>
            </Stack>
    )
}

export default Prompt