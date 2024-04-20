import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { Player } from '../types'

interface PlayerListProps {
    players: Player[];
    onRemovePlayer: (index: number) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, onRemovePlayer }) => {
    return (
        <ScrollView style={styles.container}>
            {players.map((player, index) => (
                <View key={index} style={styles.playerItem}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Button color="#ffff" title="×" onPress={() => onRemovePlayer(index)} />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 11,
    },
    playerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 8,
        backgroundColor: '#37393b',
        borderRadius: 8,
    },
    playerName: {
        color: '#fff',
        fontSize: 18,
        paddingLeft: 4,
    }
});

export default PlayerList;
