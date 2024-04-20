export const formatCentsToDollars = (cents: number): string => {
    const dollars = (cents / 100).toFixed(2); // Converts to string with two decimal places
    return dollars.toString();
};


export const formatDollarsToCents = (dollars: string): number => {
    if (dollars === '') return 0
    // Check for decimal i.e. cents
    if (dollars.includes('.')) {
        let [whole, fraction] = dollars.split('.');
        if (fraction.length === 1) {
            fraction += '0'; // Pad with '0' if necessary
        } else if (fraction.length > 2) {
            fraction = fraction.slice(0, 2);  // Truncate to two digits
        }
        return parseInt(whole + fraction, 10);
    } else {
        // Whole number, x by 100
        return parseInt(dollars, 10) * 100;
    }
};