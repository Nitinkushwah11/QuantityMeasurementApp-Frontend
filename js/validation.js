function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('error-field');
    if (error) error.textContent = message;
}

function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.remove('error-field');
    if (error) error.textContent = '';
}

function clearAllErrors() {
    const errorIds = [
        ['fullName','fullNameError'],
        ['emailId','emailIdError'],
        ['password','passwordError'],
        ['mobile','mobileError'],
        ['confirmPassword','confirmPasswordError'],
        ['loginEmail','loginEmailError'],
        ['loginPassword','loginPasswordError']
    ];
    errorIds.forEach(([i,e]) => clearError(i,e));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidMobile(mobile) {
    return /^(\+91|0)?[6-9]\d{9}$/.test(mobile.trim());
}

function isStrongPassword(password) {
    return password.length >= 6 &&
        /[A-Z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$^&]/.test(password);
}