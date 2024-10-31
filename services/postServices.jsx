import { supabase } from "../lib/supabase";
import {uploadFile} from "./imageService";

export const createorUpdatePost=async(post)=>{
  try {
    if(post.file && typeof post.file == 'object'){
      let isImage=post?.file?.type=='image';
      let folderName=isImage?'postImages':'postVideos';
      let fileResult= await uploadFile(folderName,post?.file?.uri,isImage);
      if(fileResult.success){
        post.file=fileResult.data;
      }else{
        return fileResult;
      }
    }
    const{data,error}=await supabase
    .from('posts')
    .upsert(post)
    .select()
    .single();
    if(error){
      console.log("Create or update post error", error);
    return{success:false,msg:"Could not create or update post"};
    }
    return {success:true,data:data};
  } catch (error) {
    console.log("Create or update post error", error);
    return{success:false,msg:"Could not create or update post"};
  }
}