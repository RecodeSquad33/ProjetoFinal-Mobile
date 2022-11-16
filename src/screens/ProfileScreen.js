import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, Alert, Image } from 'react-native'
import { Auth, DataStore } from 'aws-amplify'
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import { User } from '../models/';
import * as ImagePicker from 'expo-image-picker';


  const ProfileScreen = () => {
  const [user, setUser] = useState(null);  

  const [name, setName] = useState (''); 
  const [bio, setBio] = useState ('');
  const [type, setType] = useState ();
  const [lookingFor, setLookingFor] = useState ();

  useEffect(() => {
    const getCurrentUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, u => u.sub('eq', authUser.attributes.sub));
      if(!dbUsers || dbUsers.lenght === 0) {
        return;
      }
      const dbUser = dbUsers [0];
      setUser(dbUser);
      setName(dbUser.name);
      setBio(dbUser.bio);
      setType(dbUser.type);
      setLookingFor(dbUser.lookingFor);
    };
     getCurrentUser();
  }, []);

  const isValid = () => {
      return name && bio && type && lookingFor;
  }

  const save = async () => {
     if(!isValid()) {
        console.warn('Não válido');
        return;
     }

     if (user) {
      const updatedUser = User.copyOf(user, updated => {
      updated.name= name;
      updated.bio= bio;
      updated.type= type;
      updated.lookingFor= lookingFor;
    });

    await DataStore.save(updatedUser);
     }else {

     const authUser = await Auth.currentAuthenticatedUser();
    
     const newUser = new User({
      sub: authUser.attributes.sub,
      name,
      bio,
      type,
      lookingFor,
      image,
    });

    await DataStore.save(newUser)
    }

    Alert.alert('Usuário salvo com sucesso!');
  };

  const [image, setImage] = useState(null);

  const pickImage = async () => {
   
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const signOut = async () => {
    await DataStore.clear();
    Auth.signOut();
  };

 
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.label}>Eu sou?</Text>
        <Picker style={styles.picker} label='Categoria' 
                                      selectedValue={type} 
                                      onValueChange={itemValue => setType(itemValue)}  
                                      itemStyle={{ color: "white", fontSize:18 }}>
          <Picker.Item label='Instituição' value='INSTITUICAO' />
          <Picker.Item label='Voluntário' value='VOLUNTARIO' />
        </Picker>
        <Text style={styles.label}>Procurando por?</Text>
        <Picker style={styles.picker} label='Procurando' 
                                      selectedValue={lookingFor} 
                                      onValueChange={itemValue => setLookingFor(itemValue)} 
                                      itemStyle={{ color: "white", fontSize:18 }}>
          <Picker.Item label='Instituições' value='INSTITUICAO' />
          <Picker.Item label='Voluntários' value='VOLUNTARIO' />
        </Picker>

        <View style={styles.wrap}>
          <TextInput style={styles.inputName} placeholder='Nome...' value={name} onChangeText={setName} />
          <Image source={{uri: user?.image}} style={styles.avatar} />
            <Pressable onPress={pickImage}>
              <Feather name='edit' size= {25} color={'#ff9b19'} style={styles.edit} />
            </Pressable>  
        </View>
        
        <TextInput style={styles.inputBio} placeholder='Sobre...' value={bio} onChangeText={setBio} />
           <View style={styles.buttons}> 
            <Pressable onPress={save}>
              <FontAwesome name="save" size={30} color='#ff9b19' />
              <Text style={styles.textoSalvar}>Salvar</Text>
            </Pressable>
            
            <Pressable onPress={signOut}>
              <AntDesign name="logout" size={30} color='#ff9b19' />
              <Text style={styles.textoSair}>Sair</Text>
            </Pressable>
          </View> 
        </View>
    </SafeAreaView>
  )
}
export default ProfileScreen;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    padding: 10,
    flex: 1,
    backgroundColor: '#0d6efd',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    
  },

  label: {
    top: '7%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff9b19',
  },

  picker: {
    height: '18%',
    marginBottom: '10%',
    fontSize: 18,
    color: 'white',
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    marginBottom: '5%',
  },
 
    inputName: {
    width: '65%',
    height: '50%',
    borderBottomColor: '#ff9b19',
    borderBottomWidth: 2,
    fontSize: 18,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginTop: '7%',
  },

  inputBio: {
    width: '100%',
    height: '12%',
    borderBottomColor: '#ff9b19',
    borderBottomWidth: 2,
    fontSize: 18,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginTop: '2%',
  },

  textoSalvar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff9b19',
    right: '28%',
        
  },

  textoSair: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff9b19',
    right: '11%',
        
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    right: '-20%',
    borderWidth: 3,
    borderColor: '#ff9b19',
    borderRadius: 50,
    padding: 3,   
  },

  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '15%',
    marginBottom: '5%',
  },

  edit: {
    right: '5%',
    marginTop: '20%',
  }

});