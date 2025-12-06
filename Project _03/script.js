document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('calc-display');
    const datetimeDisplay = document.getElementById('datetime-display');
    const buttons = document.querySelectorAll('.btn');

    let currentInput = '0';
    let previousInput = null;
    let operation = null;
    let waitForSecondOperand = false;

    // --- 1. Date & Time Functionality ---
    function updateDateTime() {
        const now = new Date();
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        };
        const formattedDate = now.toLocaleString('en-IN', options).replace(',', '');
        datetimeDisplay.textContent = formattedDate;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000); 


    // --- Helper Function ---
    function updateDisplay(value) {
        if (String(value).length > 18) {
            // Use scientific notation for very large/small numbers
            display.textContent = Number(value).toExponential(5);
        } else {
            display.textContent = value;
        }
    }

    function inputDigit(digit) {
        if (waitForSecondOperand) {
            currentInput = digit;
            waitForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplay(currentInput);
    }

    function inputDecimal() {
        if (waitForSecondOperand) {
            currentInput = '0.';
            waitForSecondOperand = false;
            updateDisplay(currentInput);
            return;
        }
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay(currentInput);
    }

    // --- Core Calculation Logic ---
    function calculate(firstNum, secondNum, operator) {
        if (operator === '+') return firstNum + secondNum;
        if (operator === '-') return firstNum - secondNum;
        if (operator === '*') return firstNum * secondNum;
        if (operator === '/') {
            if (secondNum === 0) return 'Error'; 
            return firstNum / secondNum;
        }
        if (operator === '^') return Math.pow(firstNum, secondNum);
        return secondNum;
    }


    function handleOperator(nextOperation) {
        const inputValue = parseFloat(currentInput);

        if (currentInput === 'Error') return;

        // If an operator is already active and we press another one (e.g., 5 + 3 -)
        if (previousInput !== null && !waitForSecondOperand) {
            // Perform the previous operation and use the result as the new previousInput
            const result = calculate(previousInput, inputValue, operation);

            if (result === 'Error') {
                updateDisplay('Error');
                clearAll();
                return;
            }
            
            previousInput = result;
            currentInput = String(result);
            updateDisplay(currentInput);

        } else if (previousInput === null) {
            // First operator press
            previousInput = inputValue;
        }

        waitForSecondOperand = true;
        operation = nextOperation;
    }
    
    // --- 3. Scientific Logic ---
    function handleScientific(sc_op) {
        let value = parseFloat(currentInput);
        let result;

        if (currentInput === 'Error') return;

        switch (sc_op) {
            case 'sin':
                result = Math.sin(value * (Math.PI / 180));
                break;
            case 'cos':
                result = Math.cos(value * (Math.PI / 180));
                break;
            case 'tan':
                result = Math.tan(value * (Math.PI / 180));
                break;
            case 'log':
                if (value <= 0) { result = 'Error'; break; }
                result = Math.log10(value);
                break;
            case 'sqrt':
                if (value < 0) { result = 'Error'; break; }
                result = Math.sqrt(value);
                break;
            case 'square': 
                result = value * value;
                break;
            case 'pi': 
                result = Math.PI;
                break;
            case 'e': 
                result = Math.E;
                break;
            case 'percent':
                result = value / 100;
                break;
            case 'pow': // Sets up the x^y operation
                handleOperator('^'); 
                return;
            default:
                return;
        }

        currentInput = String(result);
        updateDisplay(currentInput);
        previousInput = null; // Result is final unless an operator is pressed next
        operation = null;
        waitForSecondOperand = true; 
    }


    // --- 4. Clearance Logic ---
    function clearAll() {
        currentInput = '0';
        previousInput = null;
        operation = null;
        waitForSecondOperand = false;
        updateDisplay(currentInput);
    }

    function deleteLast() {
        if (currentInput === '0' || currentInput === 'Error') return;
        currentInput = currentInput.length === 1 ? '0' : currentInput.slice(0, -1);
        updateDisplay(currentInput);
    }
    
    // --- 5. Event Listeners ---

    // A. Button Click Listeners
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const innerText = event.target.innerText;
            const op = event.target.dataset.op;
            
            // Check if the input is a number
            if (event.target.classList.contains('number') && op !== 'decimal') {
                inputDigit(innerText);
            } 
            // Check if the input is decimal
            else if (op === 'decimal') {
                inputDecimal();
            }
            // Check if the input is an operator
            else if (['add', 'subtract', 'multiply', 'divide'].includes(op)) {
                handleOperator(op === 'add' ? '+' : op === 'subtract' ? '-' : op === 'multiply' ? '*' : '/');
            }
            // Check if the input is equals
            else if (op === 'equals') {
                handleOperator(operation);
                operation = null; 
                waitForSecondOperand = true;
            }
            // Check if the input is a scientific function
            else if (['sin', 'cos', 'tan', 'log', 'sqrt', 'square', 'pi', 'e', 'percent', 'pow'].includes(op)) {
                handleScientific(op);
            }
            // Check if the input is clearance
            else if (op === 'clear-all') {
                clearAll();
            }
            // Check if the input is delete
            else if (op === 'delete') {
                deleteLast();
            }
        });
    });

    // B. Keyboard Input Listener (New Requirement)
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        
        // Map numbers and decimal
        if (/[0-9]/.test(key)) {
            inputDigit(key);
        } else if (key === '.') {
            inputDecimal();
        } 
        // Map operators
        else if (['+', '-', '*', '/'].includes(key)) {
            handleOperator(key);
        } 
        // Map Equals/Enter
        else if (key === 'Enter' || key === '=') {
            e.preventDefault(); // Prevents default browser action
            handleOperator(operation);
            operation = null;
            waitForSecondOperand = true;
        } 
        // Map Backspace/Delete
        else if (key === 'Backspace') {
            deleteLast();
        } else if (key === 'Delete') {
            clearAll();
        }
    });

});