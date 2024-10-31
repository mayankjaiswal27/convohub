import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Button from '../../components/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { theme } from '../../constants/theme'
import { hp } from '../../helpers/common'
import { wp } from '../../helpers/common'
import Icon from '../../assets/icons';
import { useRouter } from 'expo-router';
import Avatar from '../../components/Avatar'

const Home = () => {
  const {user, setAuth}=useAuth();
  const router=useRouter();
  console.log("user", user);
  // const onLogout=async ()=>{
  //   // setAuth(null);
  //   const {error}=await supabase.auth.signOut();
  //   if(error){
  //     Alert.alert("Sign out", error.message);
  //   }

  // }
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ConvoHub</Text>
          <View style={styles.icons}>
            <Pressable onPress={()=>router.push('notifications')}>
              <Icon name='heart' size={hp(3.2)} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={()=>router.push('newPost')}>
              <Icon name='plus' size={hp(3.2)} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={()=>router.push('profile')}>
              <Avatar
              uri={user?.image}
              size={hp(4.3)}
              rounded={theme.radius.sm}
              style={{borderWidth:2}}
              />
            </Pressable>
          </View>
        </View>
      </View>
      {/* <Button title='Logout' onPress={onLogout}/> */}
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:10,
    marginHorizontal:wp(4),
  },
  title:{
    color:theme.colors.text,
    fontSize:hp(3.2),
    fontWeight:theme.fonts.bold,
  },
  avatarImage:{
    height:hp(4.3),
    width:hp(4.3),
    borderRadius:theme.radius.sm,
    borderCurve:'continuous',
    borderColor:theme.colors.gray,
    borderWidth:3,
  },
  icons:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:18,

  },
  listStyle:{
    paddingTop:20,
    paddingHorizontal:wp(4)
  },
  noPosts:{
    fontSize:hp(2),
    textAlign:'center',
    color:theme.colors.text
  },
  pill:{
    position:'absolute',
    right:-10,
    top:-4,
    height:hp(2.2),
    width:hp(2.2),
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20,
    backgroundColor:theme.colors.roseLight,
  },
  pillText:{
    color:'white',
    fontSize:hp(1.2),
    fontWeight:theme.fonts.bold
  }
})