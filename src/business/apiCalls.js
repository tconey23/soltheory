import { database21 } from "./firebase21Things";
import { ref, get, update } from 'firebase/database';
import {auth, users, app, userApp, currentUser } from './firebaseAuth'


const handleAuth = async => {

    

}


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



export {get21Things}