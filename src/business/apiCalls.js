import { database21 } from "./firebase21Things";
import { ref, get, update, set } from 'firebase/database';
import {auth, users, app, userApp, currentUser } from './firebaseAuth'


const getUserGames = async(user) => { 
    try {
        const db = ref(database21, 'users')
        const data = await get(db)

        if(data.exists()){
            let findUser = Object.values(data.val()).findIndex((u) => u.email === user.email)
            if(findUser < 0){

                const newUserRef = ref(database21, `users/${user.uid}`)

                let newUser = {
                    email: user.email,
                    name: user.displayName,
                    created: Date.now(),
                    games: {
                        twentyOneThings: ["NA"],
                        sixPics: ["NA"]
                    }
                };
                
                const userRef = ref(database21, `users/${user.uid}`);  // Store under UID, NOT displayName
                await set(userRef, newUser);  

            } 
            
            if(findUser > -1){
                // console.log(Object.values(data.val())[findUser])
                return Object.values(data.val())[findUser]
            }
        }

    } catch (error) {
        
    }
}

const addGameToUser = async (user, gameCategory, newGame) => {
    
    console.log(user, gameCategory, newGame)
    
    if (!user) {
        console.error("User is not authenticated.");
        return;
    }

    try {
        const userGamesRef = ref(database21, `users/${user.uid}/games/${gameCategory}`);
        const snapshot = await get(userGamesRef);
        let currentGames = snapshot.exists() ? snapshot.val() : [];

        currentGames.push(newGame);

        await update(ref(database21, `users/${user.uid}/games`), {
            [gameCategory]: currentGames,
        });

        console.log(`Game added to ${gameCategory}:`, newGame);
    } catch (error) {
        console.error("Error adding game:", error);
    }
};



const get21Things = async (date) => {

    try {
        const db = ref(database21, 'categories')
        const data = await get(db)

        if(data.exists()){

            // Object.values(data.val()).forEach((ct) => {
            //     console.log(ct.date)
            // })

            const foundCat = Object.values(data.val()).findIndex((ct) => ct.date === date)

            // console.log(foundCat)

            if(foundCat > -1){
                return Object.values(data.val())[foundCat]
            } else {
                return 'None Found'
            }

        }

    } catch (error) {
        console.error(error);
        
    }
}



export {get21Things, getUserGames, addGameToUser}