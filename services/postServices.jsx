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


export const fetchPost=async(limit=10)=>{
  try {
    const {data,error}=await supabase
    .from('posts')
    .select(`*
      ,user: users(id,name,image)
      `)
    .order('created_at', {
      ascending: false,
    })
    .limit(limit);
    if(error){
      console.log("fetch post error", error);
      return{success:false,msg:"Could not fetch the post"};
    }
    return {success:true,data:data};
  } catch (error) {
    console.log("fetch post error", error);
    return{success:false,msg:"Could not fetch the post"};
  }
}