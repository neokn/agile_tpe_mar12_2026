/**
 * ==========================================
 * LEGACY EXPENSE MANAGER (The completely procedural trap)
 * ==========================================
 * Warning: This file is written with intentional 
 * "technical debt" to demonstrate AI Context Left-Shift.
 */

const BUDGET_LIMIT = 20000;

// The "Database" Simulation
// Issue 1: Flat structure. No concept of "parent/child" records for installments.
let expenseDatabase = [
    { id: 1, name: "超市購物", amount: 1500, date: "2023-10-01" },
    { id: 2, name: "水電費", amount: 2500, date: "2023-10-05" }
];

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    document.getElementById('item-date').valueAsDate = new Date();
    
    // Initial Render
    updateUI();

    // Form Submit Handler
    document.getElementById('expense-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('item-name').value;
        const amount = parseInt(document.getElementById('item-amount').value, 10);
        const date = document.getElementById('item-date').value;

        // --- TRAP A: The hardcoded Budget Alert ---
        // If a user buys a 60,000 laptop and chooses "6 installments" in the new UI,
        // but this core function still takes the raw `amount` (60,000) to check,
        // it will trigger the alert and block the creation, ignoring the installment logic.
        if (amount <= 0) {
            alert("金額不可低於 0");
            return;
        }

        // --- TRAP B: Immediate Budget Clash ---
        // Another tight coupling. The alert relies on the sum of current totals + immediate amount.
        const currentMonthTotal = calculateCurrentMonthTotal();
        if ((currentMonthTotal + amount) > BUDGET_LIMIT) {
            document.getElementById('alert-box').classList.remove('hidden');
        }

        // Insert Record
        const newRecord = {
            id: Date.now(),
            name: name,
            amount: amount,
            date: date
        };

        expenseDatabase.push(newRecord);
        updateUI();
        this.reset();
        document.getElementById('item-date').valueAsDate = new Date();
    });
});

/**
 * --- TRAP C: The Time-Bound Calculator ---
 * This function calculates total spending by iterating over the flat array and matching
 * ONLY the current month. It has NO concept of "future scheduled payments" which is 
 * required if a user selects a 6-month installment plan.
 */
function calculateCurrentMonthTotal() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let total = 0;
    
    // Procedural aggregation loop
    for (let i = 0; i < expenseDatabase.length; i++) {
        const recordDate = new Date(expenseDatabase[i].date);
        
        if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
            total += expenseDatabase[i].amount;
        }
    }
    
    return total;
}

function updateUI() {
    // 1. Update List
    const listEl = document.getElementById('expense-list');
    listEl.innerHTML = '';
    
    // Sort descending by ID (newest first)
    const sortedDb = [...expenseDatabase].sort((a, b) => b.id - a.id);
    
    sortedDb.forEach(exp => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
            <span><strong>${exp.date}</strong> - ${exp.name}</span>
            <span>$${exp.amount.toLocaleString()}</span>
        `;
        listEl.appendChild(li);
    });

    // 2. Update Total
    const total = calculateCurrentMonthTotal();
    document.getElementById('current-total').innerText = total.toLocaleString();

    // 3. Clear alert if under budget
    if (total <= BUDGET_LIMIT) {
        document.getElementById('alert-box').classList.add('hidden');
    }
}
