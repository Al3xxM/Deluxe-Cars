// Cálculo orientativo de cuotas, intereses y total financiado.
const financeForm = document.getElementById('financeForm');
const priceInput = document.getElementById('price');
const downPaymentInput = document.getElementById('downPayment');
const rateInput = document.getElementById('rate');
const monthsInput = document.getElementById('months');
const formError = document.getElementById('formError');
const currency = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

// Calcula la cuota mensual y el coste total con los valores del formulario.
function calculateFinancing() {
    const price = Number(priceInput.value);
    const downPayment = Number(downPaymentInput.value);
    const annualRate = Number(rateInput.value);
    const months = Number(monthsInput.value);
    const financed = price - downPayment;

    if (price <= 0 || downPayment < 0 || downPayment >= price || annualRate < 0 || annualRate > 30) {
        formError.textContent = 'Introduce un precio válido y una entrada menor que el precio del coche. El interés debe estar entre 0 % y 30 %.';
        formError.classList.remove('d-none');
        return;
    }

    formError.classList.add('d-none');
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = monthlyRate === 0
        ? financed / months
        : financed * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
    const totalPayment = monthlyPayment * months;

    document.getElementById('monthlyPayment').textContent = currency.format(monthlyPayment);
    document.getElementById('financedAmount').textContent = currency.format(financed);
    document.getElementById('totalInterest').textContent = currency.format(totalPayment - financed);
    document.getElementById('totalPayment').textContent = currency.format(totalPayment);
}

// Evita que el formulario recargue la página y actualiza el cálculo.
financeForm.addEventListener('submit', function (event) {
    event.preventDefault();
    calculateFinancing();
});

// Recalcula el resultado cada vez que cambia un dato.
[priceInput, downPaymentInput, rateInput, monthsInput].forEach(function (input) {
    input.addEventListener('input', calculateFinancing);
    input.addEventListener('change', calculateFinancing);
});

calculateFinancing();
