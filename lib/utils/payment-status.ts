// Calculate payment status helper
export function calculatePaymentStatus(
    priceFinal: number,
    payments: any[]
): 'paid' | 'partial' | 'unpaid' {
    if (!payments || payments.length === 0) {
        return 'unpaid';
    }

    const totalPaid = payments
        .filter(p => p.status === 'completed' || p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid >= priceFinal) {
        return 'paid';
    } else if (totalPaid > 0) {
        return 'partial';
    }

    return 'unpaid';
}
