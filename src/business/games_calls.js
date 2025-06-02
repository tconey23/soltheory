import { supabase } from "./supabaseClient"
import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
import useGlobalStore from "./useGlobalStore";


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
    let { data, error } = await supabase
    .from('21thingsprompts')
    .select('*')
            
  }

  const normalizePrompts = (value) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return Array.isArray(value) ? value : [];
  };
  
  export const cleanAndFixPromptData = async () => {
    console.log('ehere')
    const { data, error } = await supabase.from('21thingsprompts').select('*');
  
    if (error) return console.error('Fetch error:', error);
  
    const cleaned = data.map((row) => ({
      id: row.id,
      date: dayjs(row.date, ['M/D/YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD'),
      author: row.author,
      prompts: normalizePrompts(row.prompts),
    }));

    const { error: updateError } = await supabase
      .from('21thingsprompts')
      .upsert(cleaned, { onConflict: ['id'] });
  
    if (updateError) {
      console.error('Update error:', updateError);
    } else {
      console.log('✅ Prompts normalized and reuploaded');
    }
  };
  
export const addNewPrompts = async (prompts) => {
  console.log(prompts)
  if(prompts) 
      {
        const { data, error } = await supabase
        .from('21thingsprompts')
        .insert([prompts])
        .select();
        if(data?.[0]){
          return 'success'
        } else {
          return error
        }
      }
};

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
  const setAlertContent = useGlobalStore((state) => state.setAlertContent)     
  const { data: foundUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.user.id)  // use UID from auth
          .single()
      
        if (fetchError) {
          setAlertContent({text: 'An error has occured', type:'error'})
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
          setAlertContent({text: 'An error has occured', type:'error'})
          return {
            disposition: 'error',
            message: 'There was an error adding the game to your profile'
          }
        } else {
          setAlertContent({text: 'Prompt pack added', type:'success'})
          return {
            disposition: 'success',
            message: 'Game data added to your profile'
          }
        }
      }