import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Pressable, ActivityIndicator } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify, { Hub, DataStore } from 'aws-amplify';
import config from './src/aws-exports'; 

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const App = () => {
  
  const [activeScreen, setActiveScreen] = useState('HOME');
  const [isUserLoading, setIsUserLoading] = useState(true);

  const color = '#b5b5b5';
  const activeColor = '#ff9b19';

  useEffect(() => {
    const listener = Hub.listen('datastore', async hubData => {
     const { event, data } = hubData.payload;
     if (event === 'modelSynced' && data?.model?.name === 'User') {
       console.log('Modelo carregado: ${model.name}')
       setIsUserLoading(false);
       }
    });

    return() => listener();
 
   }, []);


 const renderPage= () => {
  if (activeScreen === "HOME") { 
    return <HomeScreen isUserLoading={isUserLoading} />;
  }; 
   
  if (isUserLoading) { 
    return <ActivityIndicator style={{flex:1}} />;
  }
          
  if (activeScreen === "CHAT") { 
    return <MatchesScreen/>;
  }  
    
  if (activeScreen === "PROFILE") { 
    return <ProfileScreen />;
  }  
 };

  return (
      <SafeAreaView style={styles.root}>
        <View style={styles.container}>
          <View style={styles.topNavigation}>
            
            <Pressable onPress={() => setActiveScreen('HOME')}>
              <Ionicons name='home' size={30} color={activeScreen === 'HOME' ? activeColor : color} />
            </Pressable>  
            
            <Pressable onPress={() => setActiveScreen('LIKES')}>
              <MaterialCommunityIcons name="star-four-points" size={30} color={activeScreen === 'LIKES' ? activeColor : color} />
            </Pressable> 

            <Pressable onPress={() => setActiveScreen('CHAT')}>
              <Ionicons name="ios-chatbubbles" size={30} color={activeScreen === 'CHAT' ? activeColor : color} />
            </Pressable>  
            
            <Pressable onPress={() => setActiveScreen('PROFILE')}>
              <FontAwesome name="user"  size={30} color={activeScreen === 'PROFILE' ? activeColor : color} />
              </Pressable>   
          </View>    

          {renderPage()}
          
        </View>
      </SafeAreaView>  
  );

};

const styles = StyleSheet.create ({

  root:{
    flex: 1,
    
  },

  container: {
  
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#0d6efd',
  },

  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    marginTop: '8%',
  }

});


export default withAuthenticator(App);

