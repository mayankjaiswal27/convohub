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
      ,user: users(id,name,image),
      postLikes(*)
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
export const createPostLike=async(postLike)=>{
  try {
    const {data,error}=await supabase
    .from('postLikes')
    .insert(postLike)
    .select()
    .single();

    if(error){
      console.log("fetch post error", error);
      return{success:false,msg:"Could not like the post"};
    }
    return {success:true,data:data};
  } catch (error) {
    console.log("fetch post error", error);
    return{success:false,msg:"Could not like the post"};
  }
}
export const removePostLike=async(postId,userId)=>{
  try {
    const {error}=await supabase
    .from('postLikes')
    .delete()
    .eq('postId',postId)
    .eq('userId',userId)

    if(error){
      console.log("postLike error", error);
      return{success:false,msg:"Could not remove the post"};
    }
    return {success:true};
  } catch (error) {
    console.log("postLike error", error);
    return{success:false,msg:"Could not remove the post"};
  }
}