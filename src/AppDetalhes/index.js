import { StatusBar } from 'expo-status-bar';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';


export default function AppDetalhes(props) {

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
  const [isEditable, setIsEditable] = useState(false);
  const [btnSalvarTxt, setBtnSalvarTxt] = useState("Editar");
  const [btnApagarTxt, setBtnApagarTxt] = useState("Apagar");


  async function carregarContato(id) {


    const response = await AsyncStorage.getItem('listaContatos');

    if (response) {

      let lista = JSON.parse(response);

      let contato = lista.find(obj => obj.id === id);

      setID(id);
      setFoto(contato.foto);
      setNome(contato.nome);
      setSobrenome(contato.sobrenome);
      setTelefones(contato.telefones);
      setEmails(contato.emails);
      setEndereco(contato.endereco);
      setNumero(contato.numero);
      setBairro(contato.bairro);
      setCidade(contato.cidade);

    }

  }

  function cancelarEdicao() {
    if (!isEditable) {
      setBtnSalvarTxt("Salvar");
      setBtnApagarTxt("Cancelar");
    }
    else {
      setBtnSalvarTxt("Editar");
      setBtnApagarTxt("Apagar");
    }
    setIsEditable(!isEditable);
    
  }

  function tornarEditavel() {
    if (!isEditable) {
      setBtnSalvarTxt("Salvar");
      setBtnApagarTxt("Cancelar");
    }
    else {
      setBtnSalvarTxt("Editar");
      setBtnApagarTxt("Apagar");
      atualizarContato();
    }
    setIsEditable(!isEditable);

  }

  function onRefresh() {
    setRefresh(!refresh);
  }

  function onApagar(id) {


    Alert.alert(
      "Apagar Contato!",
      "Você tem certeza que deseja prosseguir?",
      [
        {
          text: "Sim",
          onPress: () => { apagar(id) },
          style: 'default'
        },
        {
          text: "Não",
          onPress: () => { null },
          style: 'default'
        },
      ],
      {
        cancelable: true,

      }
    );

    async function apagar(id) {
      const response = await AsyncStorage.getItem('listaContatos');

      if (response) {

        let lista = JSON.parse(response);

        let contato = lista.find(obj => obj.id === id);

        lista.splice(lista.indexOf(contato), 1);

        await AsyncStorage.setItem('listaContatos', JSON.stringify(lista));

      }
      Alert.alert("Contato Apagado!");
      props.onClose();

    }

  }

  useEffect(() => {


    carregarContato(props.detalhesContato);



  }, []);

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
    if (this.editable == false) {

    }
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


  function cidadeMudou(cidade) {
    setCidade(cidade);
  }

  async function atualizarContato() {
    //validar os campos!!!

    const contatoSalvo = { id, nome, sobrenome, telefones, emails, endereco, numero, bairro, cidade, foto };
    let listaContatos = [];

    const response = await AsyncStorage.getItem('listaContatos');

    if (response) listaContatos = JSON.parse(response);

    let contato = listaContatos.find(obj => obj.id === id);

    contato = contatoSalvo;

    let listaAtualizada = listaContatos.map(obj => {
      if (obj.id === id) {
        return { ...contatoSalvo };
      } else {
        return obj;
      }
    });

    await AsyncStorage.setItem('listaContatos', JSON.stringify(listaAtualizada));


    Alert.alert("Alteração no Contato Concluida!");


  }


  return (
    <View style={styles.container} key={refresh}>
      <StatusBar style="light-content" />

      <ScrollView>
        <View style={styles.cabecalho}>
          <TouchableOpacity
            onPress={() => manipularImagem()}
            disabled={!isEditable}
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
              editable={isEditable}
            >{nome}
            </TextInput>

            <TextInput style={styles.campoSobrenome}
              placeholder='Sobrenome'
              clearButtonMode='always'
              onChangeText={sobrenomeMudou}
              editable={isEditable}>{sobrenome}</TextInput>
          </View>
        </View>
        <View style={styles.camposContato}>
          {telefones.map((telefone, index) => (
            <View key={index} style={styles.viewDinamica}>
              <TextInput
                style={styles.campoTelefone}
                value={telefone}
                onChangeText={(text) => handleChangeTelText(text, index)}
                placeholder='Telefone'
                editable={isEditable} />
              {telefones.length > 1 && (
                isEditable ? (<TouchableOpacity style={styles.btnDel} onPress={() => { handleDelTelefone(index) }}>
                  <Text style={styles.btnDelText}>-</Text>
                </TouchableOpacity>) : (null))
              }
            </View>
          ))
          }
          {isEditable ? (<TouchableOpacity style={styles.btnAdd} onPress={handleAddTelefone}
            disabled={!isEditable}
          >
            <Text style={styles.btnAddTxt}>+</Text>
          </TouchableOpacity>) : (null)}

          {emails.map((email, index) => (
            <View key={index} style={styles.viewDinamica}>
              <TextInput
                style={styles.campoTelefone}
                value={email}
                onChangeText={(text) => handleChangeEmailText(text, index)}
                placeholder='E-mail'
                editable={isEditable} />
              {emails.length > 1 && (
                isEditable ? (<TouchableOpacity style={styles.btnDel} onPress={() => { handleDelEmail(index) }}>
                  <Text style={styles.btnDelText}>-</Text>
                </TouchableOpacity>) : (null))
              }
            </View>
          ))
          }
          {isEditable ? (<TouchableOpacity style={styles.btnAdd} onPress={handleAddEmail}
            disabled={!isEditable}
          >
            <Text style={styles.btnAddTxt}>+</Text>
          </TouchableOpacity>) : (null)}


          <TextInput
            placeholder='Endereço'
            style={[styles.campoTelefone, styles.campo]}
            clearButtonMode='always'
            onChangeText={enderecoMudou}
            editable={isEditable}
          >{endereco}</TextInput>
          <View style={styles.nrBairro}>
            <TextInput
              placeholder='Nº'
              style={[styles.campoNr]}
              clearButtonMode='always'
              onChangeText={numeroMudou}
              editable={isEditable}
            >{numero}</TextInput>
            <TextInput
              placeholder='Bairro'
              style={[styles.campoBairro]}
              clearButtonMode='always'
              onChangeText={bairroMudou}
              editable={isEditable}
            >{bairro}</TextInput>
          </View>
          <TextInput
            placeholder='Cidade'
            style={[styles.campoTelefone, styles.campo]}
            clearButtonMode='always'
            onChangeText={cidadeMudou}
            editable={isEditable}

          >{cidade}</TextInput>
        </View>
        <View style={styles.areaBtn}>

          <TouchableOpacity onPress={!isEditable ? () => { onApagar(id) } : cancelarEdicao}
            style={styles.btnFechar}><Text style={styles.btnFecharTxt}>{btnApagarTxt}</Text></TouchableOpacity>

          <TouchableOpacity onPress={tornarEditavel}
            style={styles.btnFechar}><Text style={styles.btnFecharTxt}>{btnSalvarTxt}</Text></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={props.onClose}
          style={styles.btnFechar}><Text style={styles.btnFecharTxt}>Fechar</Text></TouchableOpacity>


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
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 5,
  },
  btnAddTxt: {
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
  areaBtn: {
    flexDirection: 'row',
  },
  btnFecharTxt: {
    color: '#fff'
  },
  btnFechar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    width: '40%',
    height: 40,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 50,
    backgroundColor: '#747373'
  },
});
