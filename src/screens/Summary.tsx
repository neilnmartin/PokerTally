import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Clipboard from '@react-native-clipboard/clipboard';
import { loadPlayers, savePlayers, loadBuyInAmount } from '../utils/storage';
import CustomButton from '../components/CustomButton';
import { RootStackParamList, Player, BuyInAmountInCents } from '../types';
import { formatCentsToDollars } from '../utils/format';
import NewGameModal from '../components/NewGameModal';

type SummaryScreenProps = NativeStackScreenProps<RootStackParamList, 'Summary'>;
type NavigationType = NativeStackNavigationProp<RootStackParamList, 'Summary'>

type BalanceInCents = number;

const getBalanceRowBorderColor = (balance: number) => balance === 0 ? '#0cc928' : '#d11d1d';

const getPlayerDiff = (player: Player, buyInAmountInCents: BuyInAmountInCents): number => {
    return player.chipCountInCents - (player.buyIns * buyInAmountInCents);
};

const SummaryScreen: React.FC<SummaryScreenProps> = () => {
    const navigation = useNavigation<NavigationType>()
    const [players, setPlayers] = useState<Player[]>([]);
    const [buyInAmountInCents, setBuyInAmountInCents] = useState<BuyInAmountInCents>(10);
    const [balance, setBalance] = useState<BalanceInCents>(0);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);

    useEffect(() => {
        const fetchPlayers = async () => {
            const loadedPlayers = await loadPlayers();

            const uncheckedPlayers = loadedPlayers.map((player) => ({
                ...player,
            }));
            setPlayers(uncheckedPlayers);
        };
        fetchPlayers();
    }, []);

    useEffect(() => {
        const fetchBuyInAmount = async () => {
            const buyInAmountInCents = await loadBuyInAmount();
            setBuyInAmountInCents(buyInAmountInCents)
        };
        fetchBuyInAmount();
    }, []);

    useEffect(() => {
        if (players && buyInAmountInCents) {
            let balance = players.reduce((sum, player) => {
                sum += getPlayerDiff(player, buyInAmountInCents)
                return sum;
            }, 0 as BalanceInCents)
            setBalance(balance);
        }
    }, [players, buyInAmountInCents])

    useEffect(() => {
        const storePlayers = async () => {
            await savePlayers(players);
        };
        storePlayers();
    }, [players]);

    const toggleCheckbox = (index: number) => {
        const newPlayers = [...players];
        newPlayers[index].checked = !newPlayers[index].checked;
        setPlayers(newPlayers);
    }

    const copyToClipboard = () => {
        const clipboardText: string = players.reduce((acc, player) => {
            const playerDiff = getPlayerDiff(player, buyInAmountInCents)
            const diffString = playerDiff > 0
                ? `+${formatCentsToDollars(playerDiff)}`
                : `${formatCentsToDollars(playerDiff)}`
            acc += `${player.name}: ${diffString}\n`
            return acc;
        }, '')
        Clipboard.setString(clipboardText);
    };

    const newGameButtonHandler = () => {
        setDialogVisible(true);
    }

    const closeDialog = () => {
        setDialogVisible(false);
    }

    const startNewGame = () => {
        const resetPlayers = players.map((player) => ({
            ...player,
            buyIns: 1,
            chipCountInCents: 0,
            isEditing: false,
            checked: false,
        }))
        setPlayers(resetPlayers);
        savePlayers(resetPlayers);
        navigation.navigate('PlayerScreen')
    }

    return (
        <LinearGradient
            colors={['#262829', '#1f2021']}
            style={styles.container}
        >
            {players.map((player, index) => {
                const playerDiff = getPlayerDiff(player, buyInAmountInCents)
                const playerSummary = playerDiff >= 0 ? `+${formatCentsToDollars(playerDiff)}` : `${formatCentsToDollars(playerDiff)}`

                return (

                    <TouchableOpacity key={index} style={styles.playerRow} onPress={() => toggleCheckbox(index)}>
                        <View style={styles.leftContainer}>
                            <Text style={styles.textField}>{player.name}</Text>
                            <View style={styles.checkbox}>
                                {player.checked ? (
                                    <Text style={styles.checkmark}>
                                        {`${playerDiff > 0 ? 'PAID' : 'REQUESTED'}`} ✓
                                    </Text>
                                ) : <Text style={styles.pendingText}>PENDING ⓞ</Text>}
                            </View>
                        </View>
                        <Text style={styles.textField}>{playerSummary}</Text>
                    </TouchableOpacity>
                )
            })}
            <View style={{ ...styles.balanceRow, borderColor: getBalanceRowBorderColor(balance) }}>
                <Text style={styles.textField}>Balance</Text>
                <Text style={styles.textField}>{`${balance > 0 ? `+${formatCentsToDollars(balance)}` : `${formatCentsToDollars(balance)}`}`}</Text>
            </View>
            <CustomButton title="Copy to Clipboard" onPress={() => copyToClipboard()} />
            <CustomButton title="New Game" onPress={() => newGameButtonHandler()} />
            <NewGameModal
                visible={dialogVisible}
                onClose={closeDialog}
                onConfirm={startNewGame}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#262829',
    },
    playerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 15,
        paddingVertical: 13,
        backgroundColor: '#37393b',
        borderRadius: 5,
        borderBottomWidth: 1,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        color: '#fff'
    },
    checkbox: {
        paddingLeft: 15,
    },
    checkmark: {
        fontSize: 10,
        color: '#42d92b',  // Checkmark color
    },
    pendingText: {
        fontSize: 10,
        color: '#d6bb20'
    },
    checkedView: {
        backgroundColor: 'white',
    },
    textField: {
        fontSize: 16,
        color: '#fff',
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        paddingLeft: 20,
        paddingRight: 15,
        paddingVertical: 10,
        backgroundColor: 'black',
        borderRadius: 5,
        borderWidth: 1,
    },
    dialogContainer: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    }
});

export default SummaryScreen;
