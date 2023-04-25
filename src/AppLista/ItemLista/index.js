
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function ItemLista(props) {
     
    
    return (
        <View style={styles.container}>
            <Image 
                style={styles.foto}
                source={ props.foto ?  {uri: props.foto} : require('../../../assets/photoIcon.png') }
            />
            <View style={styles.nomeContainer}>
                <Text style={styles.campoNome}>{props.nome}</Text>
                <Text style={styles.campoSobrenome}>{props.sobrenome}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
        flexDirection: 'row',
        backgroundColor: '#E5E5E5',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopColor: '#000',
        borderTopWidth: 2,
        marginBottom: 20
    },
    foto: {
        width: 90,
        height: 90,
        marginTop: 20,
        borderRadius: 50,
    },
    nomeContainer: {
        width: '60%',
        marginTop: 20,
        height: '70%',        
        marginLeft: 20,        
        
    },
    campoNome: {
        width: '100%',
        height: '50%',
        fontSize: 25,
        fontWeight: 'bold',      
        marginTop: 5
        
        
    },
    campoSobrenome: {
        width: '100%',
        height: '50%',
        fontSize: 20,          
        marginTop: -10   
        
    },
});
