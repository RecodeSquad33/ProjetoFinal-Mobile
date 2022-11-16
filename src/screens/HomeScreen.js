import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import Card from '../components/ConectaMaisCard';
import AnimatedStack from '../components/AnimatedStack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Like from '../../assets/images/like_button.png';
import Dislike from '../../assets/images/dislike_button.png';
import { User, Match } from '../models';
import { Auth, DataStore } from 'aws-amplify';


const HomeScreen = ({ isUserLoading }) => {
const [users, setUsers] = useState([]);  
const [currentUser, setCurrentUser] = useState (null);
const [me, setMe] = useState(null);

useEffect(() => {
    const getCurrentUser = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, u => u.sub('eq', user.attributes.sub));
      
      if(!dbUsers || dbUsers.lenght === 0) {
        return;
      }

      setMe(dbUsers [0]);
      
    };
     getCurrentUser();
  }, [isUserLoading]);

  
    useEffect(() => {
    if (isUserLoading || !me) {
        return;
    }
    const fetchUsers = async () => {
    const fetchUsers = await DataStore.query(User, user => user.type('eq', me.lookingFor));
    setUsers(fetchUsers);
   };
   fetchUsers(); 
}, [isUserLoading, me])

const onSwipeLeft = () => { if (!currentUser || !me) {return;} console.warn('Swipe Left', currentUser.name)};

const onSwipeRight = async () => { if (!currentUser || !me) {return;} 

const myMatches = await DataStore.query(Match, match => 
    match.User1ID('eq', me.id).User2ID('eq', currentUser.id)
);
    if (myMatches.lenght > 0) {
        console.warn("Você já deslizou para direita nesse usuário");
        return;
    }

    const hisMatches = await DataStore.query(Match, match =>
        match.User1ID('eq', currentUser.id).User2ID('eq', me.id)
    );

    if (hisMatches.length > 0) {
        console.log("Você tem um novo contato!");
        const hisMatch = hisMatches[0]; 
        DataStore.save(Match.copyOf(hisMatch, updated => (updated.isMatch = true)));
        return;
    }
        console.warn("Pedido de contato enviado");
        const newMatch = new Match({
            User1ID: me.id,
            User2ID: currentUser.id,
            isMatch: false,
        });

        console.log(newMatch);
        DataStore.save(new Match);
};

   return (
    
    <View style={styles.container}>
          
      <AnimatedStack data={users}
                   renderItem={(({ item }) => <Card user={item} />)}
                   setCurrentUser={setCurrentUser}
                   onSwipeLeft={onSwipeLeft}
                   onSwipeRight={onSwipeRight}
      />
      <View style={styles.icons}>
       
        <Pressable onPress={onSwipeLeft}>
          <Image source={Dislike} style={styles.like} />
        </Pressable>
      
        <FontAwesome name='undo' size= {50} color={'#FBD88B'} />

        <Pressable onPress={onSwipeRight}>
          <Image source={Like} style={styles.like} />
        </Pressable>
      </View>
    </View>
  );

};

const styles = StyleSheet.create ({
  container: {
  
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#0d6efd',
    width: '100%',
  },

  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginBottom: '5%',
  },

  like: {
    width: 60,
    height: 60,
    zIndex: 1,
    elevation: 1,
  },

});

export default HomeScreen;

