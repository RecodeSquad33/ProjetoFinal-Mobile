import React from 'react';
import { Text, StyleSheet, Image, ImageBackground, View } from 'react-native';
import Arrow_r from '../../../assets/images/sliding_arrow_right.png';
import Arrow_l from '../../../assets/images/sliding_arrow_left.png';

const Card = (props) => {
    const {name, image, bio, type} = props.user;
    return (<View style={styles.card}>
        <ImageBackground source={{ uri: image }} 
                         style={styles.img}>
            <View style={styles.arrows}>              
                <Image source={Arrow_r} style={[styles.arrow, {right: 20}]} />
                <Image source={Arrow_l} style={[styles.arrow, {left: -50}]} />
            </View>     
            <View style={styles.cardInner}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.bio}>{bio}</Text>
              <Text style={styles.type}>Categoria: {type}</Text>
            </View>
        </ImageBackground> 
    </View>)
}

const styles = StyleSheet.create ({
   
    card: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
      backgroundColor: '#fefefe',

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 1,
      shadowRadius: 6.68,
  
      elevation: 11,
    },
  
    img: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      justifyContent: 'flex-end',
    },
    
  
    cardInner: {
      padding: 10,
      backgroundColor: 'rgba(52, 52, 52, 0.5)',
      
    },
  
    name: {
      fontSize: 30,
      color: 'white',
      fontWeight: 'bold',
      
    },
  
    bio: {
      fontSize: 18,
      color: 'white',
      lineHeight: 25,
      
    },

    arrows: {
      top: '-20%',
      justifyContent: 'center',
      alignItems: 'center',
    },

    arrow: {
      width: 120,
      height: 100,
      position: 'absolute',
      zIndex: 1,
      elevation: 1, 
    },

    type: {
      fontWeight: 'bold',
      fontSize: 15,
      color: '#ff9b19',
    }
  })

export default Card;