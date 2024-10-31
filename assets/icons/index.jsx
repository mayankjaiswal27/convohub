import { View, Text } from 'react-native'
import React from 'react'
import Home from './Home'
import Image from './Image'
import ArrowLeft from './ArrowLeft'
import Mail from './Mail'
import Lock from './Lock'
import User from './User'
import {theme} from "../../constants/theme";
import Heart from './Heart';
import Plus from './Plus'
import Logout from './Logout'
import Edit from './Edit'
import Call from './Call'
import Camera from './Camera'
import Location from './Location'
const icons={
  home:Home,
  image:Image,
  arrowLeft: ArrowLeft,
  mail:Mail,
  lock:Lock,
  user:User,
  heart:Heart,
  plus:Plus,
  logout:Logout,
  edit:Edit,
  call:Call,
  camera:Camera,
  location:Location,
}
const Icon= ({name,...props}) => {
  const IconComponent=icons[name];
  return (
<IconComponent {...props}
height={props.size || 24}
width={props.size || 24}
strokeWidth={props.strokeWidth || 1.9}
color={theme.colors.textLight}
{...props}
/>
  )
}

export default Icon;