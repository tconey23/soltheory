import { dispose } from "@react-three/fiber";
import { supabase } from "./supabaseClient";


export const sendPush = async (to, from, message) => {
    await fetch('https://bueukhsebcjxwebldmmi.functions.supabase.co/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: to.email,
        subject: 'New SOL Mate Request!',
        message: `
          <p><strong>${from.user_name}</strong> ${message} on Sol Theory.</p>
          <p>
            <a href="https://soltheory.com/messaging" style="color: #2c7be5;">Log in to your SOL Theory account to respond.</a>
          </p>
        `
      })
    });
  };
  


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

            console.log(reqEntry)
        
        if(reqEntry){
            return reqEntry[0]
        }

        return error 

    }

    const getAllUsers = async () => {
        let { data, error } = await supabase
        .from('users')
        .select('*')
        
        if(data){
            return data
        }

    }

        // const get21Things = async (date) =>{

    //     let { data, error } = await supabase
    //     .from('21ThingsPrompts')
    //     .select('*')
    //     // .eq('date', date)

    //     const formatPrompts = (data) =>{

    //         let promptArray = []

    //         data.prompts.forEach((p) => {
    //             if(typeof p === 'string'){
    //                 promptArray.push({prompt: p})
    //             } else {
    //                 promptArray.push(p)
    //             }
    //         })

    //         return promptArray
    //     }
        
    //     if(data){
    //         const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))

    //         let formattedData

    //         sorted.forEach((d, i) =>{ 
    //             formattedData = {
    //                 id: i,
    //                 date: d.date,
    //                 author: d.author,
    //                 prompts: formatPrompts(d)
    //             }
    //             addNewPrompts(formattedData)
    //         })
    //     }

    //     return error

    // }

    
    const getUser = async (email) => {
        if (!email) return null;
      
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email.toLowerCase())
          .limit(1)
          .single();
      
        if (error) {
          console.error('[getUser] Supabase error:', error);
          return null;
        }
      
        return data;
      };
      
      
    
    const addGameToUser = async (user, newGameData) => {
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
      
    
    const getUserGames = async (user) => { 
        const { data, error } = await supabase
            .from('users')
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
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
          if (error) {
            return {
              disposition: 'error',
              message: error.message,
            };
          }
      
          if (data?.session) {
            return {
              disposition: 'success',
              session: data.session,
            };
          }
      
          // Just in case something weird happens
          return {
            disposition: 'error',
            message: 'Unknown login error.',
          };
        } catch (err) {
          console.error('Unexpected error in signIn:', err);
          return {
            disposition: 'error',
            message: 'Unexpected login failure.',
          };
        }
      };

      const signOut = async () => {
        try {
          const { error } = await supabase.auth.signOut().catch(console.error);
      
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
      
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password
        });
      
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
        .from('sixpicspacks')
        .select("*")
        .eq('pack_name', packName?.pack_name)

        if(data && data[0]){
            return data[0]
        }
            
        } catch (error) {
            console.log(error);
            
        }

    }
    
    const getSixPicsPack = async (cat) => {
        console.log(cat)
        
        try {
            
        let { data, error } = await supabase
        .from('sixpicspacks')
        .select('id')
        .eq('pack_name', cat)
        .single()

        if(data){
            console.log(data)
            return data
        }
        
        } catch (error) {
            return error
        }
    }

    const getSixPicsPacks = async () => {
        
        try {
            
        let { data, error } = await supabase
        .from('sixpicsvideos')
        .select('*')

        if(data){
            return data
        }
        
        } catch (error) {
            return error
        }
    }

    const addToExistingPack = async (cat, obj) => {
        try {
            // Fetch existing gifs
            let { data, error } = await supabase
                .from('sixpicspacks')
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
                .from('sixpicspacks')
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
                .from('sixpicspacks')
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
        "url": "https://tzzljniuogvssdbhxsql.supabase.co/storage/v1/object/public/6picsvideos/1741727317584/titanic.mp4",
        "name": "titanic.mp4",
        "answer": "titanic.mp4",
        "length": 11
    };


    const addNewPack = async (name) => {
        const { data, error } = await supabase
        .from('sixpicspacks')
        .insert([
        { pack_name: name, gifs: [], graphic: ''},
        ])
        .select()

        console.log(data, error)
    }
 
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
                .from("6picsvideos/packs") // Bucket name
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
            const { data: publicUrlData } = supabase.storage.from("6picsvideos").getPublicUrl(filePath);
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
    
        try {
            let { data, error } = await supabase
                .from("sixpicspacks")
                .insert([newCat])
                .select('*');
    
            if (error) {
                console.log("Insert failed:", error.message);
            } else {
                return 'success'
            }
        } catch (err) {
            console.log("Unexpected error:", err);
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

    const openverseAPI = async () => {
      try {
        const res = await fetch(`https://api.openverse.org/v1/auth_tokens/register/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: "SolTheory",
            description: "Health and wellness app",
            email: "tom@soltheory.com"
          })
        });
    
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
    
        const data = await res.json();
        console.log('✅ Token registration success:', data);
    
      } catch (error) {
        console.error('❌ Token registration error:', error);
      }
    };

    const getAccessToken = async () => {
      const res = await fetch('https://api.openverse.org/v1/auth_tokens/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: '32L2fWIjueTLZ6fnoQNrOa9zZxWe4Ke81OnVdamS',
          client_secret: '9yZkCno7YnPm4vYYYPyGfYPuWfUAfvGk4u2vXt3du2LVeYrj3A5Xoo7q5K4BvHCmo1FQ0MrQ8a8PbEBvz3Mog6AHY93007gVRKKg0CBpdNzpLaAnEXCnAhdTOqi1aKou',
          grant_type: 'client_credentials'
        })
      });
    
      const data = await res.json();
 
      return data.access_token;
    };

  

    const findAvatars = async (query, mature, cat) => {
      const token = await getAccessToken();
    
      let page = 1;
      const pageSize = 20;
      let allMatchingImages = [];
      let maxPages = 5

    
      while (page <= maxPages) {

    
        const endpoint = `https://api.openverse.org/v1/images?q=${encodeURIComponent(query)}&page=${page}`
          + (mature ? `&mature=${mature}` : '')
          + (cat ? `&category=${encodeURIComponent(cat)}` : '');
    
          console.log(endpoint)
    
        try {
          const res = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    
          if (!res.ok) {
            console.error(`❌ Error fetching page ${page}:`, res.status, res.statusText);
            break;
          }
    
          const { results } = await res.json();
    
          if (!results || results.length === 0) {
            console.log('⚠️ No more results.');
            break;
          }
    
          // Filter: must have tags and match the query string
          const matching = results.filter(image => {
            return (
              image.tags &&
              image.tags.length > 0 &&
              image.tags.some(tag =>
                tag.name.toLowerCase().includes(query.toLowerCase())
              )
            );
          });
    
          allMatchingImages.push(...matching);
    
    
          if (allMatchingImages.length >= 30) {
            console.log('🎯 Found enough matching images. Stopping early.');
            break;
          }
    
          page++;
        } catch (error) {
          console.error('❌ Fetch failed:', error);
          break;
        }
      }
    
      return allMatchingImages;
    };
    
    

    const updateUserAvatar = async (userId, avatarUrl) => {
        const { data, error } = await supabase
          .from('users') // your table name
          .update({ avatar: avatarUrl })
          .eq('id', userId) // match user by ID
          .select(); // optional: returns updated row
      
        if (error) {
          console.error('Failed to update avatar:', error);
          return { success: false, error };
        }
      
        return { success: true, data };
      };


    export {addNewPack, getSixPicsPacks, getAllUsers, updateUserAvatar, findAvatars, checkAndAddUsers, updatePackLogo, addNewCategory, get21Things, getUserGames, addGameToUser, addFriend, getUser, addNewPrompts, signIn, signOut, signUpUser, getGifs, getSixPicsPack, uploadVid, checkExistingPack, addToExistingPack, removeGifByName}