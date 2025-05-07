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
                sx={{width: '100%', transition: 'all 0.25s ease-in-out', '&:hover': {cursor: 'pointer', scale: 1.05}, marginTop: '4px', marginBottom: '5px', marginLeft: '5px', marginRight: '5px'}} 
                alignItems={'center'} 
                justifyContent={'center'} 
                boxShadow={'1px 1px 7px 1px #0000007a'} 
                borderRadius={2} 
                height={'80px'} 
                maxWidth={'100%'}
                backgroundColor={color}
            >
                <Typography fontFamily={'Fredoka Regular'} sx={{textOverflow: 'ellipsis'}} textAlign={'center'} fontSize={10}>{prompt}</Typography>
            </Stack>
    )
}

export default Prompt