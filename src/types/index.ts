type Cent = number;

export type Player = {
    name: string;
    buyIns: number;
    chipCountInCents: Cent;
    isEditing?: boolean;
    checked?: boolean;
}

export type BuyInAmountInCents = Cent;

export type RootStackParamList = {
    PlayerScreen: undefined;
    BuyInScreen: undefined;  // This suggests no navigation parameters are expected.
    ChipCount: undefined;
    Summary: undefined;
};
