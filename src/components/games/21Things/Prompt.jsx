import useGlobalStore from "../../../business/useGlobalStore"
import { Stack } from "@mui/system"
import { Typography } from "@mui/material"

const Prompt = ({prompt, color}) => {
    const isMobile = useGlobalStore((state) => state.isMobile)
    const user = useGlobalStore((state) => state.user)
    const setUser = useGlobalStore((state) => state.setUser)
    const session = useGlobalStore((state) => state.session)
    const setSession = useGlobalStore((state) => state.setSession)
    const userMeta = useGlobalStore((state) => state.userMeta)
    const setUserMeta = useGlobalStore((state) => state.setUserMeta)

    return (
        <Stack
            userdata='21things prompt' 
            padding={isMobile ? '10px' :2} 
            sx={{transition: 'all 0.25s ease-in-out', '&:hover': {cursor: 'pointer', scale: 1.05}, marginTop: '4px', marginBottom: '5px', marginLeft: '5px', marginRight: '5px'}} 
            alignItems={'center'} 
            justifyContent={'center'} 
            boxShadow={'1px 1px 7px 1px #0000007a'} 
            borderRadius={2} 
            width={isMobile ? '90px' : '150px'} height={'80px'} 
            backgroundColor={color}
         >
            <Typography textAlign={'center'} padding={isMobile ? '1px' :2} fontSize={isMobile ? 9 : 13}>{prompt}</Typography>
        </Stack>
    )
}

export default Prompt