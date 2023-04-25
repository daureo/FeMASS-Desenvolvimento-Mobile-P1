import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import ItemLista from './ItemLista';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshControl } from 'react-native-gesture-handler';
import AppDetalhes from '../AppDetalhes';
import { useCallback } from 'react';

export default function AppLista() {
//Criar funcoes para manipular os dados soh daqui.. nenhum componente acessa mais os dados...

  const [listaContatos, setListaContatos] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [mostrarViewDetalhes, setMostrarViewDetalhes] = useState(false);
  const [contatoDetalhado, setContatoDetalhado] = useState();

  async function carregarLista() {
    const response = await AsyncStorage.getItem('listaContatos');

    if (response) {
      let listaOrdenada = JSON.parse(response);

      setListaContatos(listaOrdenada.sort((a, b) => a.nome.localeCompare(b.nome)));
    }
    
  } 

  const onRefresh = useCallback(() => {
    setRefresh(true);
    carregarLista();
    setRefresh(false);
    
  }, [refresh]);

  useEffect(() => {


    carregarLista();



  }, [onRefresh]);

  function chamarDetalhes(item) {    
    setContatoDetalhado(item);
    setMostrarViewDetalhes(true);
  }

  function onCloseSecondScrollView(){
    setMostrarViewDetalhes(false);
  }

  

  //selecionar do banco de dados e buscar o item com o ID fornecido e entao passar o obj
  //usar essa id para passar a identificacao do contato para a tela de vizualizacao, que ira ler do banco somente aquele contato
  return (
    <View style={styles.container} key={refresh}>
      <StatusBar style="light-content" />

      {mostrarViewDetalhes ? (
      <AppDetalhes onClose={onCloseSecondScrollView} detalhesContato={contatoDetalhado}/>      
      
      ) : (
        <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.itemsContainer}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
        
      >
        {listaContatos.map(item => {
          return <TouchableOpacity
            onPress={() => chamarDetalhes(item.id)}
            key={item.id}
          >
            <ItemLista id={item.id} nome={item.nome} sobrenome={item.sobrenome} foto={item.foto} />
          </TouchableOpacity>
        })}

      </ScrollView>

      )

      }

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
