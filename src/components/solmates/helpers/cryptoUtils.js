import { supabase } from "../../../business/supabaseClient";

export const generateCipherKey = async () => {
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    const raw = await crypto.subtle.exportKey("raw", key);
    return btoa(String.fromCharCode(...new Uint8Array(raw)));
  }; 
  
  export const importKeyFromBase64 = async (base64Key) => {
    const raw = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    return await crypto.subtle.importKey("raw", raw, "AES-GCM", true, ["encrypt", "decrypt"]);
  };
  
  export const encryptWithKey = async (text, key) => {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(text));
    return {
      iv: btoa(String.fromCharCode(...iv)),
      data: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
    };
  };
  
  export const decryptWithKey = async (base64Data, base64Iv, key) => {
    const decoder = new TextDecoder();
    const iv = Uint8Array.from(atob(base64Iv), c => c.charCodeAt(0));
    const encryptedBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedBytes);
    return decoder.decode(decrypted);
  };

  const encrypt = async (text, from) => {
    const cipherKey = await generateCipherKey();
    const importedKey = await importKeyFromBase64(cipherKey);
    const encrypted = await encryptWithKey(text, importedKey);
  
    const msg = {
      iv: encrypted.iv,                    
      sent_by: from,
      encr_text: encrypted.data,        
      most_recent_msg: '05/08/2025',
      crypto_key: cipherKey              
    };
  
    return msg;
  };

  const insertMsg = async () => {

    console.clear()

    const msgs = [
      {text: 'Hey check out my scores', from: 'c9e527a1-e002-4596-9b12-0c825f2f8809'},
      {text: 'Wow! Great job!', from: '57e7ab2f-8c16-4d01-bc41-33e2398a51b4'},
      {text: 'Thanks! Have you played todays 21 things?', from: 'c9e527a1-e002-4596-9b12-0c825f2f8809'}
    ]

    let array = []

    for(let i=0; i < msgs.length; i++){
      let res = await encrypt(msgs[i].text, msgs[i].from)
      array.push(res)
    }
      const { data, error } = await supabase
      .from('messaging')
      .insert([
        {
          created_at: '05/01/2025', 
          from: '57e7ab2f-8c16-4d01-bc41-33e2398a51b4',
          to: 'c9e527a1-e002-4596-9b12-0c825f2f8809',
          message_content: array,
          subject: 'Check out my scores!'
        },
      ])
      .select()
        
  }

  // insertMsg() 



 
