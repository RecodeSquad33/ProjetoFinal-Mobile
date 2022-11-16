import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, Text } from 'react-native';
import Animated, { useSharedValue, 
                   useAnimatedStyle, 
                   withSpring, 
                   useAnimatedGestureHandler, 
                   useDerivedValue,
                   interpolate,
                   runOnJS} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Like from '../../../assets/images/like_button.png';
import Dislike from '../../../assets/images/dislike_button.png';




const ROTATION = 60;
const SWIPED_VELOCITY = 800;

const AnimatedStack = (props) => {

  const { data, renderItem, onSwipeRight, onSwipeLeft, setCurrentUser } = props;

  const [currentIndex, setCurrentIndex] = useState (0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1)
  
  const currentProfile = data [currentIndex];
  const nextProfile = data [nextIndex];

  const {width: screenWidth} = useWindowDimensions();

  const hiddenTranslateX = 2 * screenWidth;

  const translateX = useSharedValue(0);
  const rotate = useDerivedValue(() => interpolate(
    translateX.value, [0, hiddenTranslateX], [0, ROTATION]) + 'deg',);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        rotate: rotate.value,
      }
    ]
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      
        {scale: interpolate(translateX.value, [-hiddenTranslateX, 0 , hiddenTranslateX], [1, 0.8, 1])}],
        opacity: interpolate(translateX.value, [-hiddenTranslateX, 0 , hiddenTranslateX], [1, 0.5, 1]),           
  
    }));

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0 , hiddenTranslateX / 10], [0, 1]), 
  }))

  const disLikeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0 , -hiddenTranslateX / 10], [0, 1]),
  }))

  const gestureHandler = useAnimatedGestureHandler({

    onStart: (_, context) => {
      context.startX = translateX.value;
    },

    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      
    },

    onEnd: (event) => {
      if (Math.abs(event.velocityX) < SWIPED_VELOCITY) {
        translateX.value = withSpring(0);
        return;
      }

      translateX.value = withSpring(hiddenTranslateX * Math.sign(event.velocityX), {}, () => runOnJS(setCurrentIndex)(currentIndex +1));

      const onSwipe = event.velocityX > 0 ? onSwipeRight : onSwipeLeft;
      onSwipe && runOnJS(onSwipe)();
    },
  });

  useEffect (() => {
    translateX.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex]);

  useEffect(() => {
    setCurrentUser(currentProfile);
  }, [currentProfile]);

   return (
    
    <View style={styles.root}>
      {nextProfile && (
          <View style={styles.nextCardContainer}>
            <Animated.View style={[styles.animatedCard, nextCardStyle]}>
             {renderItem({ item: nextProfile })}   
            </Animated.View>
          </View>  
      )}

      {currentProfile ? (
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.animatedCard, cardStyle]}>
              <Animated.Image source={Like} style={[styles.like, {left: 30}, likeStyle]} />
              <Animated.Image source={Dislike} style={[styles.like, {right: 30}, disLikeStyle]} />
                {renderItem({ item: currentProfile })}
            </Animated.View>
          </PanGestureHandler> 
        ) : (
            <View>
                <Text style={styles.warning}>Ops, não há mais usuários...</Text>
            </View>
        )} 
               
    </View>
    

   );

};

const styles = StyleSheet.create ({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#0d6efd',
    width: '100%',
  },

  animatedCard: {
    width: '90%', 
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    },

    nextCardContainer: {
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center',
    alignItems: 'center',
    },

    like: {
      width: 80,
      height: 80,
      position: 'absolute',
      top: 10,
      zIndex: 1,
      elevation: 1,
    },

    warning: {
      color: '#b5b5b5',
      fontSize: 18,

    }
            
});

export default AnimatedStack;

