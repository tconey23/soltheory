import { supabase } from "./supabaseClient";
import { useGlobalContext } from "./GlobalContext";


export const listAllPacks = async () => {
    try {
        let { data: packs, error } = await supabase
        .from('sixpicspacks')
        .select('*')

        if(packs){
            return packs
        } else if(error){
            throw new Error(error)
        }
    } catch (error) {
        return error
    }
}
