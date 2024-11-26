import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Avatar from './Avatar'
const CommentItem = ({
    item,
    canDelete=false,
    onDelete=()=>{}
})=> {
    const createdAt = moment(item?.created_at).format('MMM D');
    const handleDelete = ()=>{
        Alert.alert("Are you sure? Your comment will be deleted.", [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: 'cancel',
            },
            {
              text: "Delete",
              onPress: () => onDelete(item),
              style: 'destructive',
            },
          ]);
    }
  return (
    <View styles={styles.container}>
        <Avatar
        uri={item?.user?.image}
        />
        <View style={styles.content}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View style={styles.nameContainer}>
                    <Text style={styles.text}>
                        {
                            item?.user?.name
                        }
                    </Text>
                    <Text>.</Text>
                    <Text style={[styles.text,{color:theme.colors.textLight}]}>
                        {
                            created_at
                        }
                    </Text>
                </View>
                {
                    canDelete && (
                        <TouchableOpacity onPress={handleDelete}>
                            <Icon name="delete" size={20} color={theme.colors.rose}/>
                        </TouchableOpacity>
                    ) 
                }
        </View>
        <Text style={[styles.text,{fontWeight:'normal'}]}>
        {item?.text}
        </Text>
    </View>
    </View>
  )
}

export default CommentItem
const styles = StyleSheet.create({})
//css code