import { decryptWithKey, importKeyFromBase64} from "./cryptoUtils";

export const handleDecrypt = async (messData, user) => {
    const newInbound = [];
    const newOutbound = [];

    for (const m of messData) {
      try {
        const key = await importKeyFromBase64(m.iv);
        // m.subject = await decryptWithKey(m.subject, m.subject_iv, key);
        m.message_content = await decryptWithKey(m.message_content, m.message_iv, key);

        console.log(m)

        if (m.to?.primary_id === user?.primary_id) newInbound.push(m);
        if (m.from?.primary_id === user?.primary_id) newOutbound.push(m);
      } catch (err) {
        console.error('Decryption error:', err);
      }
    }

    console.log(newInbound, newOutbound)

    return({ inbound: newInbound, outbound: newOutbound });
  };