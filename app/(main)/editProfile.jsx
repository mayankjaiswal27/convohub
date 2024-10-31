import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState,useEffect } from 'react'
import { theme } from '../../constants/theme'
import { wp } from '../../helpers/common'
import { hp } from '../../helpers/common'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import {Image} from 'expo-image';
import { useAuth } from '../../contexts/AuthContext'
import { getUserImageSrc } from '../../services/imageService'
import Icon from '../../assets/icons'
import Input from "../../components/Input";
import Button from '../../components/Button';
import { updateUser } from '../../services/userService';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '../../services/imageService';
const EditProfile = () => {
  const {user:currentUser,setUserData}=useAuth();
  const [loading,setLoading]=useState(false);
  const router=useRouter();
  const [user,setUser] =useState({
    name:'',
    phoneNumber:'',
    bio:'',
    address:'',
  }
  );
  useEffect(()=>{
    if(currentUser){
      setUser({
        name:currentUser.name,
        phoneNumber:currentUser.phoneNumber||'',
        image:currentUser.image||null,
        address:currentUser.address||'',
        bio:currentUser.bio||'',

      })
    }
  },[currentUser]);
  const onPickImage=async ()=>{
    let result=await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setUser({...user, image:result.assets[0]});
    }
  };
  const onSubmit=async ()=>{
    let userData={...user};
    let {name,phoneNumber,image,address,bio}=userData;
    if(!name|| !phoneNumber || !address || !bio || !image){
      Alert.alert("Profile", "Please fill all the fields");
      return;
    }
    setLoading(true);
    if(typeof image === 'object'){
      let imageRes=await uploadFile('profiles',image?.uri,true);
      if(imageRes.success){
        userData.image=imageRes.data;
      }else{
        Alert.alert("Profile", imageRes.msg);
      }
    }
    const res=await updateUser(currentUser?.id,userData);
    setLoading(false);
    if(res.success){
      setUserData({...currentUser,...userData});
      router.back();
    }
  }
  console.log("user image", typeof user.image);
  let imageSource=user.image&& typeof user.image == 'object' ?user.image.uri: getUserImageSrc(user.image);
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title='Edit Profile' showBackButton={true} mb={30} />
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
            <Image source={imageSource} style={styles.avatar} />
            <Pressable style={styles.cameraIcon}>
              <Icon name='camera' size={20} strokeWidth={2.5} onPress={onPickImage} />
            </Pressable>
            </View>
            <Text style={{fontSize:hp(1.5),color:theme.colors.text}}>Please fill your profile details</Text>
            <Input
            icon={<Icon name='user'/>}
            placeholder='Enter your Name'
            value={user.name}
            onChangeText={value=>setUser({...user,name:value})}
            ></Input>
                        <Input
            icon={<Icon name='call'/>}
            placeholder='Enter your phone number'
            value={user.phoneNumber}
            onChangeText={value=>setUser({...user,phoneNumber:value})}
            ></Input>
                        <Input
            icon={<Icon name='location'/>}
            placeholder='Enter your address'
            value={user.address}
            onChangeText={value=>setUser({...user,address:value})}
            ></Input>
            <Input
            placeholder='Enter your bio'
            value={user.bio}
            multiline={true}
            containerStyle={styles.bio}
            onChangeText={value=>setUser({...user,bio:value})}
            ></Input>
             <Button title='Update' loading={loading} onPress={onSubmit}/>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 10,
    marginTop: 20,
  },

  input: {
    flexDirection: "row",
    borderWidth: "0.4",
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: "15",
  },
})
