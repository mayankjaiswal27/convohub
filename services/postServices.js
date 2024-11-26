import { supabase } from "../lib/supabase";
import {uploadFile} from "./imageService";

export const createOrUpdatePost = async (post) => {
  try {
    if (post.file && typeof post.file === "object") {
      let isImage = post?.file?.type === "image";
      let folderName = isImage ? "postImages" : "postVideos";
      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileResult.success) {
        post.file = fileResult.data;
      } else {
        return fileResult;
      }
    }
    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();
    if (error) {
      console.log("Create or update post error", error);
      return { success: false, msg: "Could not create or update post" };
    }
    return { success: true, data };
  } catch (error) {
    console.log("Create or update post error", error);
    return { success: false, msg: "Could not create or update post" };
  }
};

export const fetchPostDetails = async (postid) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*,
        user: users(id,name,image),
        postLikes(*),
        comments(*, users(id,name,image))`
      )
      .eq("id", postid)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();
    if (error) {
      console.log("fetchPostDetails error", error);
      return { success: false, msg: "Could not fetch the post" };
    }
    return { success: true, data };
  } catch (error) {
    console.log("fetchPostDetails error", error);
    return { success: false, msg: "Could not fetch the post" };
  }
};
export const createPostLike = async (postLike)=>{
  try {
    const {data,error}=await supabase
    .from('postLikes')
    .insert(postLike)
    .select()
    .single();
    if(error){
      console.log("postlike error", error);
      return{success:false,msg:"Could not like post"};
    }
    return {success:true,data:data};
  } catch (error) {
    console.log('postlike error', error);
    return{success:false,msg:"Could not like post"};
  }
}
export const removePostLike = async (postLike)=>{
  try {
    const {error}=await supabase
    .from('postLikes')
    .delete()
    .eq('userId',userId)
    .eq('postId',postId)
    if(error){
      console.log("postlike error", error);
      return{success:false,msg:"Could not remove the like"};
    }
    return {success:true};
  } catch (error) {
    console.log('postlike error', error);
    return{success:false,msg:"Could not remove the like"};
  }
}

export const createComment = async (comment)=>{
  try {
    const {data,error}=await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single();
    if(error){
      console.log("comment error", error);
      return{success:false,msg:"Could not create comment"};
    }
    return {success:true,data:data};
  } catch (error) {
    console.log('comment error', error);
    return{success:false,msg:"Could not create comment"};
  }
}

export const removeComment = async (commentId)=>{
  try {
    const {error}=await supabase
    .from('comments ')
    .delete()
    .eq('id',commentId)

    if(error){
      console.log("removeComment error", error);
      return{success:false,msg:"Could not remove the comment"};
    }
    return {success:true,data:{commentId}};
  } catch (error) {
    console.log('removeComment error', error);
    return{success:false,msg:"Could not remove the comment"};
  }
}