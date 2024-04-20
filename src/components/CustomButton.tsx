import React from 'react';
import { TouchableHighlight, Text, StyleSheet, View, GestureResponderEvent } from 'react-native';

type CustomButtonProps = {
    onPress: (event: GestureResponderEvent) => void;
    title: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title }) => (
    <TouchableHighlight underlayColor="#37393b" onPress={onPress} style={styles.button}>
        <Text style={styles.text}>{title}</Text>
    </TouchableHighlight>
);

const styles = StyleSheet.create({
    button: {
        // backgroundColor: '#37393b',  // Customizable color
        padding: 15,
        margin: 5,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#37393b'
    },
    text: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    }
});

export default CustomButton;