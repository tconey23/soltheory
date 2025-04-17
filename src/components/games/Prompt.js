import { useGlobalContext } from "../../business/GlobalContext"
import { Stack } from "@mui/system"
import { Typography } from "@mui/material"

const Prompt = ({prompt, color}) => {
    const {alertProps, setAlertProps, isMobile} = useGlobalContext()

    return (
        <Stack
            userData='21things prompt' 
            padding={isMobile ? 'px' :2} 
            sx={{transition: 'all 0.25s ease-in-out', '&:hover': {cursor: 'pointer', scale: 1.05}, marginTop: '5px', marginBottom: '5px', marginLeft: '5px', marginRight: '5px'}} 
            alignItems={'center'} 
            justifyContent={'center'} 
            boxShadow={'1px 1px 7px 1px #0000007a'} 
            borderRadius={6} 
            width={isMobile ? '120px' : '150px'} height={'85px'} 
            backgroundColor={color}
         >
            <Typography textAlign={'center'} padding={isMobile ? '1px' :2} fontSize={isMobile ? 9 : 13}>{prompt}</Typography>
        </Stack>
    )
}

export default Prompt