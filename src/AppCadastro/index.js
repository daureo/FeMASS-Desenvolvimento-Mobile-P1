import { StatusBar } from 'expo-status-bar';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';


export default function AppCadastro() {

  //Poderia ser feito com classes?
  const [id, setID] = useState();
  const [foto, setFoto] = useState();
  const [nome, setNome] = useState();
  const [sobrenome, setSobrenome] = useState();
  const [telefones, setTelefones] = useState(['']);
  const [emails, setEmails] = useState(['']);
  const [endereco, setEndereco] = useState();
  const [numero, setNumero] = useState();
  const [bairro, setBairro] = useState();
  const [cidade, setCidade] = useState();

  const [refresh, setRefresh] = useState(false);



  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });



    if (!result.canceled) {
      fotoMudou(result.assets[0].uri);
    }
  };

  const takeImage = async () => {

    let permissaoCamera = await ImagePicker.requestCameraPermissionsAsync();


    if (permissaoCamera.granted === false) {
      alert("Você negou a permissão da câmera");
      return;
    }

    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });


      if (!result.canceled) {
        fotoMudou(result.assets[0].uri);

      }
    } catch (error) {
      console.log(error);
    }


  };

  function manipularImagem() {
    Alert.alert(
      "Adicionar Foto",
      "Informe de onde você quer adicionar a foto",
      [
        {
          text: "Galeria",
          onPress: () => { pickImage() },
          style: 'default'
        },
        {
          text: "Câmera",
          onPress: () => { takeImage() },
          style: 'default'
        },
      ],
      {
        cancelable: true,
        onDismiss: () => console.log("Cancelado"),
      }
    );
  }

  function idMudou() {
    setID();
  }

  function fotoMudou(foto) {
    setFoto(foto);
  }

  function nomeMudou(nome) {
    setNome(nome);
  }

  function sobrenomeMudou(sobrenome) {
    setSobrenome(sobrenome);
  }

  function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const ddd = cleaned.substring(0, 2);
    const firstPart = cleaned.substring(2, 7);
    const secondPart = cleaned.substring(7, 11);
    const formattedPhoneNumber = `(${ddd})${firstPart}-${secondPart}`;
    
    return formattedPhoneNumber;
  }

  function handleChangeTelText(text, index) {
    const novosTelefones = [...telefones];
    novosTelefones[index] = formatPhoneNumber(text);
    setTelefones(novosTelefones);

  }

  function handleAddTelefone() {
    const novosTelefones = [...telefones, ''];
    setTelefones(novosTelefones);
  }

  function handleDelTelefone(indexToRemove) {
    setTelefones((prevTels) => {
      const novosTels = prevTels.filter((_, index) => index !== indexToRemove);
      return novosTels;
    });
  }

  function handleChangeEmailText(text, index) {
    const novosEmails = [...emails];
    novosEmails[index] = text;
    setEmails(novosEmails);

  }

  function handleAddEmail() {
    const novosEmails = [...emails, ''];
    setEmails(novosEmails);
  }

  function handleDelEmail(indexToRemove) {
    setEmails((prevEmails) => {
      const novosEmails = prevEmails.filter((_, index) => index !== indexToRemove);
      return novosEmails;
    });
  }

  function enderecoMudou(endereco) {
    setEndereco(endereco);
  }

  function numeroMudou(numero) {
    setNumero(numero);
  }

  function bairroMudou(bairro) {
    setBairro(bairro);
  }


  function limparCampos() {

    setID(null);
    setFoto(null);
    setNome(null);
    setSobrenome(null);
    setEmails(['']);
    setTelefones(['']);
    setEndereco(null);
    setNumero(null);
    setBairro(null);
    setCidade(null);
    setRefresh(!refresh);



  }

  function cidadeMudou(cidade) {
    setCidade(cidade);
  }

  function validarCampos() {
    if (!nome || !sobrenome || !endereco || !numero || !bairro || !cidade) {
      Alert.alert("Preencha todos os campos obrigatórios");
      return false;
    }
    return true;
  }


  async function salvarContato() {

    if (validarCampos()) {
      const contatoSalvo = { id: new Date().getTime(), nome, sobrenome, telefones, emails, endereco, numero, bairro, cidade, foto };
      let listaContatos = [];

      const response = await AsyncStorage.getItem('listaContatos');

      if (response) listaContatos = JSON.parse(response);

      listaContatos.push(contatoSalvo);

      await AsyncStorage.setItem('listaContatos', JSON.stringify(listaContatos));

      limparCampos();

      Alert.alert("Novo Contato Salvo!");
    }

  }


  return (
    <View style={styles.container} key={refresh}>
      <StatusBar style="light-content" />

      <ScrollView>
        <View style={styles.cabecalho}>
          <TouchableOpacity
            onPress={() => manipularImagem()}
          >
            <Image
              style={styles.foto}
              source={foto ? { uri: foto } : require('../../assets/photoIcon.png')}

            /></TouchableOpacity>
          <View style={styles.nomeContainer}>

            <TextInput style={styles.campoNome}

              placeholder='Nome'
              clearButtonMode='always'
              onChangeText={nomeMudou}
            >
            </TextInput>

            <TextInput style={styles.campoSobrenome}
              placeholder='Sobrenome'
              clearButtonMode='always'
              onChangeText={sobrenomeMudou}>
            </TextInput>
          </View>
        </View>
        <View style={styles.camposContato}>


          {telefones.map((telefone, index) => (
            <View key={index} style={styles.viewDinamica}>
              <TextInput
                style={styles.campoTelefone}
                value={telefone}
                onChangeText={(text) => handleChangeTelText(text, index)}
                placeholder='Telefone' />
              {telefones.length > 1 && (
                <TouchableOpacity style={styles.btnDel} onPress={() => { handleDelTelefone(index) }}>
                  <Text style={styles.btnDelText}>-</Text>
                </TouchableOpacity>)
              }
            </View>
          ))
          }
          <TouchableOpacity style={styles.btnAdd} onPress={handleAddTelefone}>
            <Text style={styles.btnAddText}>+</Text>
          </TouchableOpacity>

          {emails.map((email, index) => (
            <View key={index} style={styles.viewDinamica}>
              <TextInput
                style={styles.campoTelefone}
                value={email}
                onChangeText={(text) => handleChangeEmailText(text, index)}
                placeholder='E-mail' />
              {emails.length > 1 && (
                <TouchableOpacity style={styles.btnDel} onPress={() => { handleDelEmail(index) }}>
                  <Text style={styles.btnDelText}>-</Text>
                </TouchableOpacity>)
              }
            </View>
          ))
          }
          <TouchableOpacity style={styles.btnAdd} onPress={handleAddEmail}>
            <Text style={styles.btnAddText}>+</Text>
          </TouchableOpacity>


          <TextInput
            placeholder='Endereço'
            style={[styles.campoTelefone, styles.campo]}
            clearButtonMode='always'
            onChangeText={enderecoMudou}
          ></TextInput>
          <View style={styles.nrBairro}>
            <TextInput
              placeholder='Nº'
              style={[styles.campoNr]}
              clearButtonMode='always'
              onChangeText={numeroMudou}
            ></TextInput>
            <TextInput
              placeholder='Bairro'
              style={[styles.campoBairro]}
              clearButtonMode='always'
              onChangeText={bairroMudou}
            ></TextInput>
          </View>
          <TextInput
            placeholder='Cidade'
            style={[styles.campoTelefone, styles.campo]}
            clearButtonMode='always'
            onChangeText={cidadeMudou}
          ></TextInput>
        </View>
        <TouchableOpacity style={styles.btnSalvar}
          onPress={salvarContato}
        >
          <Text style={styles.btnSalvarTxt}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerTelefone: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cabecalho: {
    flex: 1,
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 30
  },
  foto: {
    width: 100,
    height: 100,
    marginTop: 30,
    borderRadius: 50,
  },
  nomeContainer: {
    width: '60%',
    marginTop: 20,
    height: '70%',
    marginLeft: 20,

  },
  campoNome: {
    textAlign: 'center',
    width: '100%',
    height: '40%',
    fontSize: 15,
    fontWeight: 'bold',

    borderColor: '#fff',
    borderWidth: 1,
  },
  campoSobrenome: {
    textAlign: 'center',
    width: '100%',
    height: '40%',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 30,
    borderColor: '#fff',
    borderWidth: 1,
  },
  camposContato: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 30,
    height: '100%',


  },
  viewDinamica: {
    flexDirection: 'row'
  },
  campoTelefone: {
    marginTop: 10,
    borderColor: '#fff',
    borderWidth: 1,
    width: 250,
    height: 40,
    backgroundColor: '#D9D9D9',
    textAlign: 'center',
  },
  nrBairro: {
    flexDirection: 'row',
  },
  campoBairro: {
    marginTop: 10,
    borderColor: '#fff',
    borderWidth: 1,
    width: '57%',
    height: 40,
    backgroundColor: '#D9D9D9',
    textAlign: 'center'
  },
  campoNr: {
    marginTop: 10,
    borderColor: '#fff',
    borderWidth: 1,
    width: '20%',
    height: 40,
    backgroundColor: '#D9D9D9',
    marginRight: 10,
    textAlign: 'center',
  },
  campo: {
    marginTop: 10,
    borderColor: '#fff',
    borderWidth: 1,
    width: '80%',
    height: 40,
    backgroundColor: '#D9D9D9'
  },
  campoDinamico: {
    flexDirection: 'row',
  },
  btnAdd: {
    width: '71%',
    borderColor: '#fff',
    borderWidth: 1,
    height: 40,
    textAlign: 'center',
    alignContent: 'center',
    marginTop: 5,
  },
  btnAddText: {
    width: '100%',
    textAlign: 'center',
  },
  btnDel: {
    width: '10%',
    borderColor: '#fff',
    borderWidth: 1,
    height: 30,
    textAlign: 'center',
    alignSelf: 'center',
    marginLeft: 5
  },
  btnDelText: {
    width: '100%',
    textAlign: 'center',
  },
  btnSalvarTxt: {
    color: '#fff'
  },
  btnSalvar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    width: '50%',
    height: 40,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 50,
    backgroundColor: '#747373'
  },
});
