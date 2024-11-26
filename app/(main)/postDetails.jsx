import {StyleSheet,Text,View} from 'react-native'
import React from 'react'
import {useLocalSearchParams, useRouter} from 'expo-router'
import { useState, useEffect, useRef } from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Loading, Postcard, Input, Icon } from '../components'; 
import { supabase } from '../services/supabaseClient'

const PostDetails=()=>{
    const {postid} = useLocalSearchParams();
    const {user} = useAuth();
    const router = useRouter();
    const [startLoading,setStartLoading] = useState(true);
    const inputRef = useRef(null);
    const commentRef = '';
    const [loading,setLoading] = useState(false);
    console.log('got post id: ',postid);
    //console.log('post details:',post);
    const [post,setPost] = useState(null);

    const handleNewComment = async (payload) => {
      console.log('payload: ', payload.new);
      if(payload.new){
        let newComment = {...payload.new};
        let res = await getUserData(newComment.userId);
        newComment.user == res.success? res.data:{};
        setPost(prevPost => ({
            ...prevPost,
            comments: [newComment, ...prevPost.comments],
        }));
    }
    }
    useEffect(() => {
        const commmentChannel = supabase
          .channel('comments')
          .on(
            'postgres_changes',
            { event: 'INSERT', 
                schema: 'public', 
                filter: `"postId"=eq.${postid}`,
                table: 'comments' },
            (payload) => handleNewComment(payload)
          )
          .subscribe();
    
        getPostDetails();
    
        return () => {
          supabase.removeChannel(CommentChannel);
        };
      }, []);
    
    const getPostDetails = async()=>{
        //fetch post details
        let res = await fetchPostDetails(postid);
        console.log('post details: ',res);
        if(res.success){
            setPost(res.data);
            setStartLoading(false);
        }
    }
    const onNewComment = ()=>{
        if(!commentRef.current) return null;
        let data ={
            userId:user?.id,
            postid:post?.id,
            text:commentRef.current
        }
        setLoading(true);
        let res = await createComment(data);
        setLoading(false);
        if(res.success){
            inputRef?.current?.clear();
            commentRef.current='';
        }
        else{
            Alert.alert('comment',res.msg);
        }
    }
    const onDeleteComment = async(comment)=>{
        let res = await removeComment(comment?.id);
        if(res.success){
            setPost(post=>{
                let updatedPost = {...prevPost};
                updatedPost.comments = updatedPost.comments.filter(item=>item.id!=comment?.id);
                return updatedPost;
            })
        }else{
            Alert.alert('comment',res.msg);
        }
    }
    if(startLoading){
        return(
            <View style={styles.container}>
                <Loading/>
            </View>
        )
    }
    if(!post){
        return(
            <View style={[styles.container,{justifyContent:'flex-start',marginTop:100}]}>
                <Text style={styles.notFound}>Post not found</Text>
            </View>
        )
    }
    return(
        <View>
            {/* <Text>
                PostDetails
            </Text> */}
            <ScrollView showsVerticalScrollIndicator={false}contentContainerStyle={StyleSheet.list}>
                <Postcard
                    item = {{...post,comments:[{count: post?.comments?.length}]}}
                    currentUser = {currentUser}
                    router = {router}
                    hasShadow = {false}
                    showMoreIcon = {false}
                />
                {/* comment input */}
                <Input
                    inputRef = {inputRef}
                    placeholder = "Add a comment"
                    onChangeText = {value=> commentRef.current = value}
                    placeholderTextColor = {theme.colors.textLight}
                    conatinerStyle = {{flex:1,height:hp(6.2),borderRadius:theme.radius.xl}}
                />
                {
                    loading?(
                        <View style={styles.loading}>
                            <Loading size="small"/>
                        </View>
                    ):(
                        <TouchableOpacity style={styles.senIcon} onPress={onNewComment}>
                    <Icon name="send"  color={theme.colors.primaryDark}/>
                </TouchableOpacity>
                    )
                }
            {/* comment list */}
            <View style={{marginVertical: 15,gap:17}}>
                {
                    post?.comments?.map((comment)=>
                    <commentItem
                    key={comment?.id?.toString()}
                    item={comment}
                    onDelete={onDeleteComment}
                    canDelete={user.id==comment.userId||user.id==post.userId}
                    />
            )
        }{
            post.comments?.length === 0 &&(
                <Text style={{color:theme.colors.text, marginLeft:5}}>
                    Be first to comment
                </Text>
            )
        }
        </View>
            </ScrollView>
        </View>
    )
}

export default PostDetails

//css code

