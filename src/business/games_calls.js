import { supabase } from "./supabaseClient"

export const listAllPacks = async () => {
  let { data: sixpicspacks, error } = await supabase
  .from('sixpicspacks')
  .select('*')

  if(sixpicspacks){
    return sixpicspacks
  }
}

export const getGames = async () => {

    let { data: games, error } = await supabase 
    .from('games')
    .select('*')

    if(games){
        return games
    }
            
}

export const getPrompts = async () => {

}

export const get21Things = async (index) =>{
        
        const { data: reqEntry, error } = await supabase
            .from('21thingsprompts')
            .select('*')
            .order('id', { ascending: false })
            .range(index, index) // Offset by 1, return 1 record

            // console.log(index, reqEntry)
        
        if(reqEntry){
            return reqEntry[0]
        }

        return error 

    }

export const getGifs = async () => {

}

export const addGameToUser = async (user, newGameData) => {
        const { data: foundUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.user.id)  // use UID from auth
          .single()
      
        if (fetchError) {
          console.error("Error fetching user:", fetchError)
          return
        }
      
        const updatedGameData = foundUser.game_data
          ? [...foundUser.game_data, newGameData]
          : [newGameData]
      
        const { error: updateError } = await supabase
          .from('users')
          .update({ game_data: updatedGameData })
          .eq('user_id', user.user.id) // match on auth.uid()
      
        if (updateError) {
          return {
            disposition: 'error',
            message: 'There was an error adding the game to your profile'
          }
        } else {
          return {
            disposition: 'success',
            message: 'Game data added to your profile'
          }
        }
      }