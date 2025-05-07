import { supabase } from "../../../../business/supabaseClient";

export const getVideoDuration = (videoUrl) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = videoUrl;
    
    video.onloadedmetadata = () => {
      resolve(video.duration); // Duration in seconds
      video.remove(); // Clean up the video element
    };

    video.onerror = () => {
      reject("Error loading video metadata.");
    };
  });
};

export const fetchVideos = async (pack) => {
  // console.log('pack id', pack)
  let { data: sixpicspacks, error } = await supabase
  .from('sixpicspacks')
  .select("*")
  .eq('id', pack)
  .single()

  if(sixpicspacks?.videos){
    return sixpicspacks.videos
  }
}

export const fetchPacks = async () => {
  let { data: packs, error } = await supabase
  .from('sixpicspacks')
  .select("*")

  if (packs) return packs

}