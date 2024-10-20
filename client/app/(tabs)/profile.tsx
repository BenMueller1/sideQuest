import { SafeAreaView } from "react-native-safe-area-context";
import {TextInput, Text, View, ScrollView } from 'react-native';

export default function Profile() {
    const inputStyle = {
        backgroundColor: '#324C30',
        color: 'white',
        width: 300,
        padding: 10,
        borderRadius: 10,
        borderColor: '#ffffff',
        borderWidth: 1,
        marginTop: 10,
        marginX: "auto"
    };

    return (
        <SafeAreaView style={{flex:1, flexDirection: "column", justifyContent: "center"}}>
            <ScrollView>
                <TextInput placeholder="First Name" placeholderTextColor={'white'} style={inputStyle}></TextInput>
                <TextInput placeholder="Last Name" placeholderTextColor={'white'} style={inputStyle}></TextInput>
                <TextInput placeholder="age" placeholderTextColor={'white'} style={inputStyle}></TextInput>
                <TextInput placeholder="Gender" placeholderTextColor={'white'} style={inputStyle}></TextInput>

            </ScrollView>
           
            
            
        </SafeAreaView>
    );
}
