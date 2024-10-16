import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { loadPlayers, savePlayers, loadBuyInAmount, saveBuyInAmount } from '../utils/storage';
import CustomButton from '../components/CustomButton';


import { RootStackParamList, Player } from '../types';
import { formatCentsToDollars, formatDollarsToCents } from '../utils/format';

type BuyInScreenProps = NativeStackScreenProps<RootStackParamList, 'BuyInScreen'>;
type NavigationType = NativeStackNavigationProp<RootStackParamList, 'BuyInScreen'>;

const BuyInScreen: React.FC<BuyInScreenProps> = () => {
    const navigation = useNavigation<NavigationType>();
    const [players, setPlayers] = useState<Player[]>([]);
    const [buyInAmount, setBuyInAmount] = useState<string>('')
    const [isEditingBuyInAmount, setIsEditingBuyInAmount] = useState<boolean>(false);

    useEffect(() => {
        const fetchPlayers = async () => {
            const players = await loadPlayers();
            setPlayers(players);
        };
        fetchPlayers();
    }, []);

    useEffect(() => {
        const fetchBuyInAmount = async () => {
            const buyInAmountInCents = await loadBuyInAmount();
            setBuyInAmount(formatCentsToDollars(buyInAmountInCents))
        };
        fetchBuyInAmount();
    }, []);

    useEffect(() => {
        savePlayers(players);
    }, [players]);

    const handleIncrement = (index: number) => {
        const newBuyIns = [...players];
        newBuyIns[index].buyIns += 1;
        setPlayers(newBuyIns);
    };

    const handleDecrement = (index: number) => {
        const newBuyIns = [...players];
        if (newBuyIns[index].buyIns > 1) {
            newBuyIns[index].buyIns -= 1;
        }
        setPlayers(newBuyIns);
    };

    const handleBuyInAmountChange = (amount: string) => {
        setBuyInAmount(amount);
    }

    const confirmBuyInAmount = () => {
        const buyInAmountInCents = formatDollarsToCents(buyInAmount);
        saveBuyInAmount(buyInAmountInCents)
        toggleEdit();
    }

    const toggleEdit = () => {
        setIsEditingBuyInAmount(!isEditingBuyInAmount)
    }

    const onInputButtonPress = () => isEditingBuyInAmount ? confirmBuyInAmount() : toggleEdit()

    return (
        <LinearGradient
            colors={['#262829', '#1f2021']}
            style={styles.container}
        >
            <View style={styles.buyInHeader}>
                <Text style={styles.playerName}>Buy-In Amount: </Text>
                <View style={styles.rightContainer}>
                    <Text style={styles.dollarText}>$</Text>
                    {isEditingBuyInAmount ? (
                        <TextInput
                            style={styles.buyInInput}
                            value={buyInAmount}
                            onChangeText={(value) => handleBuyInAmountChange(value)}
                            keyboardType="numeric"
                        />
                    ) : (
                        <Text style={styles.buyInDisplay} onPress={onInputButtonPress}>{buyInAmount}</Text>
                    )}
                    <CustomButton
                        title={isEditingBuyInAmount ? "✓" : "✏️"}
                        onPress={onInputButtonPress}
                    />
                </View>
            </View>
            <ScrollView style={styles.scrollView}>
                {players.map((player, index) => (
                    <View key={index} style={styles.playerRow}>
                        <Text style={styles.playerName}>{player.name}</Text>
                        <View style={styles.buttonsContainer}>
                            <Button color='#fff' title="-" onPress={() => handleDecrement(index)} />
                            <Text style={styles.buyIns}>{player.buyIns}</Text>
                            <Button color='#fff' title="+" onPress={() => handleIncrement(index)} />
                        </View>
                    </View>
                ))}
            </ScrollView>
            <CustomButton title="Chip Counts >" onPress={() => navigation.navigate('ChipCount')} />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        fontSize: 24,
        backgroundColor: '#262829',
    },
    buyInHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        paddingLeft: 20,
        paddingRight: 8,
        paddingVertical: 8,
        backgroundColor: 'black',
        borderRadius: 11,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        color: '#fff'
    },
    buyInInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#37393b',
        padding: 5,
        width: 90,
        marginRight: 10,
        textAlign: 'right',
        color: '#fff',
        fontSize: 18,
    },
    buyInDisplay: {
        padding: 5,
        width: 70,
        color: '#fff',
        fontSize: 18,
    },
    dollarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    scrollView: {
        padding: 10,
    },
    playerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingLeft: 20,
        paddingRight: 15,
        paddingVertical: 8,
        backgroundColor: '#37393b',
        borderRadius: 11,
    },
    playerName: {
        fontSize: 18,
        color: '#fff'
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buyIns: {
        marginHorizontal: 10,
        fontSize: 22,
        color: '#fff'
    }
});

export default BuyInScreen;
