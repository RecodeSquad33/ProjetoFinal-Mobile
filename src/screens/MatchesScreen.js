import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { DataStore, Auth } from 'aws-amplify';
import { Match, User } from '../models';

const MatchesScreen = () => {
  const [matches, setMatches] = useState([]);
  const [me, setMe] = useState(null);

  const getCurrentUser = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const dbUsers = await DataStore.query(User, u => u.sub('eq', user.attributes.sub));
    
    if(!dbUsers || dbUsers.lenght === 0) {
      return;
    }

    setMe(dbUsers [0]);
    
  };

  useEffect(() => getCurrentUser(), []);
  

  useEffect(() => {
    if (!me) {
      return;
    }
    const fetchMatches = async() => {
      const result = await DataStore.query(Match, m => m.or('eq', true).or(m1=>m1.User1ID('eq', me.id).User2ID('eq', me.id)));
      
      setMatches(result);
    };
    fetchMatches();
  }, [me]);
  
  useEffect(() => {
    const subscription = DataStore.observe(Match).subscribe(msg=> {
     if(msg.opType === 'UPDATE') {
      const newMatch = msg.element;
       if(
        newMatch.isMatch &&
        (newMatch.User1ID === me.id || newMatch.User2ID === me.id)
       ) {
        console.log('Há um novo contato esperando por você!');
       }
     }
      console.log('--------');
      console.log(msg.model, msg.opType, msg.element);
    });

    return() => subscription.unsubscribe();

  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
         <Text style={styles.matches}>Novos Contatos</Text>
            <View style={styles.users}> 
                  {matches.map(match => {
                    const matchUser = match.User1ID === me.id ? match.User2 : match.User1;
                    if (!match.User1 || !match.User2) {
                      return (
                      <View  style={styles.user} key={match.id}>
                      <Image source= {{}}
                            style={styles.image} />
                      <Text  style={styles.name}>New match</Text>      
                    </View>
                      );
                    }
                    return (
                    <View  style={styles.user} key={match.id}>
                      <Image source= {{ uri: matchUser.image }}
                            style={styles.image} />
                      <Text  style={styles.name}>{matchUser.name}</Text>      
                    </View>
                  )})}
            </View>
      </View>
    </SafeAreaView>
  )
}
export default MatchesScreen

const styles = StyleSheet.create({
  root: {
    width: '100%',
    padding: 10,
    flex: 1,
    backgroundColor: '#0d6efd',
  },

  container: {
    padding: 10, 
    alignItems: 'center',
  
  },

  matches: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#ff9b19',
  },

  users: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  user: {
    width: 80,
    height: 80,
    margin: 10,
    borderWidth: 3,
    borderColor: '#ff9b19',
    borderRadius: 50,
    padding: 3,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },

  name:{
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  }
});