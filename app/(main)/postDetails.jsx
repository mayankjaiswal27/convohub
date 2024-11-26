import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
export default function PostDetails() {
  const { postId } = useLocalSearchParams();
  console.log('postId', postId);
  return (
    <View >
      <Text>Post Details</Text>
    </View>
  );
}
