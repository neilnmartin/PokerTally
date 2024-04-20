import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';

import CustomButton from './CustomButton';

type NewGameModalDialogProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const NewGameModal = ({ visible, onClose, onConfirm }: NewGameModalDialogProps) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Are You Sure?</Text>
                    <Text style={styles.modalDescription}>
                        {`Starting a new game will reset game info. \nIt will keep the player list.`}
                    </Text>
                    <View style={styles.buttonRow}>
                        <CustomButton title="Cancel" onPress={onClose} />
                        <CustomButton title="New Game" onPress={onConfirm} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Semi-transparent background
    },
    modalView: {
        margin: 15,
        backgroundColor: '#262829',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 5,
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 18,
        color: '#fff'
    },
    modalDescription: {
        // marginBottom: 20,
        padding: 10,
        textAlign: "center",
        color: '#fff'
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'space-around',
        marginHorizontal: -10,
    }
});

export default NewGameModal;
