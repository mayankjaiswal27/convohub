import { StyleSheet, Text, View, TouchableOpacity, Alert, Share } from 'react-native';
import React, { useEffect, useState } from 'react';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import Avatar from './Avatar';
import moment from 'moment';
import Icon from '../assets/icons';
import RenderHTML from 'react-native-render-html';
import { Image } from 'expo-image';
import { getSupabaseFileUrl } from '../services/imageService';
import { Video } from 'expo-av';
import { createPostLike, removePostLike } from '../services/postServices';
import { stripHtmlTags } from '../helpers/common';
import { downloadFile } from '../services/imageService';
import Loading from './Loading';

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

const tagsStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};
const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow=true,
  showMoreIcon=true,
}) => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };
  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);

  const created_at = moment(item?.created_at).format('MMM D');

  const onShare = async () => {
    setLoading(true);
    try {
      let content = { message: stripHtmlTags(item?.body) };
      await Share.share(content);
    } catch (error) {
      Alert.alert('Error', 'Failed to share the post');
    } finally {
      setLoading(false);
    }
  };

  const openPostDetails = () => {
   router.push({ pathname: 'postDetails', params: { postId: item?.id } });

  };

  const onLike = async () => {
    if (liked) {
      let updatedLikes = likes.filter((like) => like.userId !== currentUser?.id);
      setLikes([...updatedLikes]);
      let res = await removePostLike(item?.id, currentUser?.id);
      console.log('removed likes', res);
      if (!res.success) {
        Alert.alert('Post', 'Something went wrong');
      }
    } else {
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };
      setLikes([...likes, data]);
      let res = await createPostLike(data);
      console.log('added like', res);
      if (!res.success) {
        Alert.alert('Post', 'Something went wrong');
      }
    }
  };

  const liked = likes.some((like) => like.userId === currentUser?.id);
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar size={hp(4.5)} uri={item?.user?.image} rounded={theme.radius.md} />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{created_at}</Text>
          </View>

        </View>
        <TouchableOpacity onPress={openPostDetails}>
          <Icon name="threeDotsHorizontal" size={hp(3.4)} color={theme.colors.text} strokeWidth={3} />
        </TouchableOpacity>
      </View>
      {
            showMoreIcon && (
              <TouchableOpacity onPress={openPostDetails}>
                <Icon name="threeDotsHorizontal" size={hp(3.4)} color={theme.colors.text} strokeWidth={3}/>
              </TouchableOpacity>
            ) 
          }
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHTML
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagsStyles}
            />
          )}
        </View>
        {item?.file && item?.file?.includes('postImages') && (
          <Image
            source={getSupabaseFileUrl(item?.file)}
            transition={100}
            style={styles.postMedia}
            contentFit="cover"
          />
        )}
        {item?.file && item?.file?.includes('postVideos') && (
          <Video
            style={[styles.postMedia, { height: hp(30) }]}
            source={{ uri: getSupabaseFileUrl(item?.file) }}
            useNativeControls
            resizeMode="cover"
            isLooping
          />
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name="heart"
              size={22}
              fill={liked ? theme.colors.rose : 'transparent'}
              color={liked ? theme.colors.rose : theme.colors.textLight}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={22} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          {loading ? (
            <Loading size="small" />
          ) : (
            <TouchableOpacity onPress={onShare}>
              <Icon name="share" size={22} color={theme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: 'continuous',
    padding: 10,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.bold,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  postMedia: {
    height: hp(40),
    width: '100%',
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
});
