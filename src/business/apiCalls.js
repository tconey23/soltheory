import { dispose } from "@react-three/fiber";
import { supabase } from "./supabaseClient";


async function checkAndAddUsers(user) {


}


const addFriend = async (user, friend) => {
}


    const addNewPrompts = async (prompts) => {
        if(prompts) 
            {
                const { data, error } = await supabase
                .from('21thingsprompts_duplicate')
                .insert([
                    prompts
                ])
                .select()
                if (error) {
                    console.error('Error inserting:', error);
                } else {
                    return 'success'
                }
            }
    };


    const get21Things = async (index) =>{
        
        const { data: reqEntry, error } = await supabase
            .from('21thingsprompts')
            .select('*')
            .order('id', { ascending: false })
            .range(index, index) // Offset by 1, return 1 record
        
        if(reqEntry){
            return reqEntry[0]
        }

        return error 

    }

    const getAllUsers = async () => {
        let { data, error } = await supabase
        .from('userlist')
        .select('*')
        
        if(data){
            return data
        }

    }
    
    const getUser = async (email) => {
        let { data, error } = await supabase
        .from('userlist')
        .select('*')
        .eq('email', email.toLowerCase())
        
        if(data && data[0]){
            return data?.[0]
        }
        
        return error
        
    }
    
    const addGameToUser = async (user, newGameData) => {
        const { data: foundUser, error: fetchError } = await supabase
          .from('userlist')
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
          .from('userlist')
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
      
    
    const getUserGames = async (user) => { 
        const { data, error } = await supabase
            .from('userlist')
            .select('game_data')
            .eq('email', user.email)
            .single();  // Ensures only one record is fetched
    
        if (error) {
            console.error("Error fetching user games:", error);
            return null; // Return null to indicate failure
        }
    
        console.log("Fetched game data:", data);
    
        return data?.game_data || [];  // Ensure we return an array even if empty
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      
        if (error) {
          console.error("Login error:", error);
          // Optional: clear storage on failed login
          localStorage.removeItem('user');
          localStorage.setItem('isAuthenticated', 'false');
          return {
            disposition: 'error',
            message: error.message,
          };
        }

        const responseData = {
          disposition: 'success',
          message: `Welcome ${data.user.email}`,
          session: data?.session,
          user: data?.user,
        }
      
        // Save user info to localStorage
        localStorage.setItem('user', JSON.stringify(responseData));
        localStorage.setItem('isAuthenticated', 'true');
      
        return responseData
      };

      const signOut = async () => {
        try {
          const { error } = await supabase.auth.signOut();
      
          localStorage.removeItem('user');
          localStorage.setItem('isAuthenticated', 'false');
      
          if (error) {
            console.error('Sign out error:', error);
            return {
              disposition: 'error',
              message: 'There was a problem signing out.',
              error,
            };
          }
      
          return {
            disposition: 'success',
            message: 'You have been signed out successfully.',
          };
        } catch (err) {
          console.error('Unexpected signOut failure:', err);
          return {
            disposition: 'error',
            message: 'Unexpected error during sign out.',
            error: err,
          };
        }
      };
      
      

      const signUpUser = async (email, password, username) => {
        console.log(email, password, username);
      
        const { data, error } = await supabase.auth.signUp({ email, password });
      
        if (error) {
          return {
            message: 'Error creating profile',
            disposition: 'error',
            error
          };
        }
      
        const user = data.user;
      
        if (!user?.id) {
          console.error("User signup failed: no ID");
          return {
            message: 'User signup failed',
            disposition: 'error'
          };
        }
      
        const { updateData, error: updateError } = await supabase
        .from('users') // ← make sure this matches your table name exactly
        .update({ user_name: username })
        .eq('primary_id', user.id)
        .select(); // ← removes the .single() so it won't throw if no match

        if (updateError) {
        console.error("Error updating username:", updateError);
        return {
            message: 'Error updating username',
            disposition: 'error',
            error: updateError
        };
        }

        if (!updateData || updateData.length === 0) {
        console.warn("No rows returned on username update — possible bad primary_id");
        }
      
        console.log("User profile created!");
        return {
          message: 'Profile created successfully',
          disposition: 'success'
        };
      };
      
      
    

    const getGifs = async (packName) => {
        try {  

        let { data, error } = await supabase
        .from('SixPicsPacks')
        .select("*")
        .eq('pack_name', packName)

        if(data && data[0]){
            return data[0]
        }
            
        } catch (error) {
            console.log(error);
            
        }

    }
    
    const getSixPicsPack = async (cat) => {
        
        try {
            
        let { data, error } = await supabase
        .from('SixPicsPacks')
        .select(cat)

        if(data){
            return data
        }
        
        } catch (error) {
            console.log(error);
        }
    }

    const addToExistingPack = async (cat, obj) => {
        try {
            // Fetch existing gifs
            let { data, error } = await supabase
                .from('SixPicsPacks')
                .select('gifs')
                .eq('pack_name', cat)
                .single(); // Ensure we get one row
    
            if (error) {
                console.error("Error fetching existing gifs:", error.message);
                return;
            }
    
            let existingGifs = data?.gifs || []; // Use existing gifs or empty array
            let updatedGifs = [...existingGifs, obj]; // Append new obj
    
            // Update the row with the new gifs array
            let { error: updateError } = await supabase
                .from('SixPicsPacks')
                .update({ gifs: updatedGifs })
                .eq('pack_name', cat);
    
            if (updateError) {
                console.error("Error updating gifs:", updateError.message);
            } else {
                console.log("Successfully updated gifs!");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };
    
    const checkExistingPack = async (cat, obj) => {
        try {
            let { data, error } = await supabase
                .from('SixPicsPacks')
                .select('*')
                .eq('pack_name', cat);
    
            if (error) {
                console.error("Error checking existing pack:", error.message);
                return;
            }
    
            if (data.length > 0) {
                console.log("Pack exists, adding to it...");
                await addToExistingPack(cat, obj);
                return 'success'
            } else {
                console.log("Pack does not exist.");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };
    
    // Example object to add
    let obj = {
        "url": "https://tzzljniuogvssdbhxsql.supabase.co/storage/v1/object/public/6pics_videos/1741727317584/titanic.mp4",
        "name": "titanic.mp4",
        "answer": "titanic.mp4",
        "length": 11
    };


 
    const uploadVid = async (file) => {



        if (!file) {
            console.error("No file selected");
            return;
        }
    
        console.log("Uploading file:", file);
    
        try {
            // Define the correct path inside the "vids" folder
            const filePath = `${Date.now()}/${file.name}`;
    
            let { data, error } = await supabase.storage
                .from("6pics_videos") // Bucket name
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });
    
            if (error) {
                console.error("Upload failed:", error.message);
                return;
            }
    
            console.log("File uploaded successfully:", data.path);
            
            // Get the public URL
            const { data: publicUrlData } = supabase.storage.from("6pics_videos").getPublicUrl(filePath);
            console.log("Public URL:", publicUrlData.publicUrl);

            return publicUrlData.publicUrl
    
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    const removeGifByName = async (packName, gifName) => {
        try {
            // Step 1: Fetch the existing gifs array
            let { data, error } = await supabase
                .from("SixPicsPacks")
                .select("gifs")
                .eq("pack_name", packName)
                .single();
    
            if (error) {
                console.error("Error fetching gifs:", error.message);
                return;
            }
    
            let existingGifs = data?.gifs || [];
    
            // Step 2: Remove the object that matches the given name
            let updatedGifs = existingGifs.filter(gif => gif.name !== gifName);
    
            // Step 3: Update the table with the new array
            let { error: updateError } = await supabase
                .from("SixPicsPacks")
                .update({ gifs: updatedGifs })
                .eq("pack_name", packName);
    
            if (updateError) {
                console.error("Error updating gifs:", updateError.message);
            } else {
                return ('success');
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };
    
    
    const addNewCategory = async (cat) => {
        let newCat = {
            created_at: new Date().toISOString(), // Proper timestamp format
            pack_name: cat,
            gifs: [], // Empty array for new category
            graphic: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
        };
    
        console.log("Adding new category:", newCat);
    
        try {
            let { data, error } = await supabase
                .from("SixPicsPacks")
                .insert([newCat])
                .select('*');
    
            if (error) {
                console.error("Insert failed:", error.message);
            } else {
                return 'success'
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    const updatePackLogo = async (vid, packName) => {

        const res = await uploadVid(vid)
        console.log(res)

        try {
            let { error: updateError } = await supabase
            .from("SixPicsPacks")
            .update({ graphic: res })
            .eq("pack_name", packName);

            if (updateError) {
                console.error("Error updating gifs:", updateError.message); 
            } else {
                return ('success');
            }
        } catch (error) {
            console.error(error);
            
        }
    }

    const findAvatars = async (query) => {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${query ? query : 'abstract'}&per_page=10&client_id=9IrboRmW-r0KlptyqhiWGlB4Bt_QWPOR4Y11SS5wxAs`)
        const data = await res.json()

        if(data.total > 0 && data.results.length > 0) {
            return data
        } else {
            return 'Search returned 0 results'
        }
    }    

    const updateUserAvatar = async (userId, avatarUrl) => {
        const { data, error } = await supabase
          .from('userlist') // your table name
          .update({ avatar: avatarUrl })
          .eq('id', userId) // match user by ID
          .select(); // optional: returns updated row
      
        if (error) {
          console.error('Failed to update avatar:', error);
          return { success: false, error };
        }
      
        return { success: true, data };
      };


    export {getAllUsers, updateUserAvatar, findAvatars, checkAndAddUsers, updatePackLogo, addNewCategory, get21Things, getUserGames, addGameToUser, addFriend, getUser, addNewPrompts, signIn, signOut, signUpUser, getGifs, getSixPicsPack, uploadVid, checkExistingPack, addToExistingPack, removeGifByName}