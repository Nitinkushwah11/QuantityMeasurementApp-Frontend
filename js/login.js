function handleLogin() {
    clearAllErrors();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    let hasError = false;

    if (!email) {
        showError('loginEmail','loginEmailError','Email required.');
        hasError = true;
    } else if (!isValidEmail(email)) {
        showError('loginEmail','loginEmailError','Invalid email.');
        hasError = true;
    }

    if (!password) {
        showError('loginPassword','loginPasswordError','Password required.');
        hasError = true;
    } else if (!isStrongPassword(password)) {
        showError('loginPassword','loginPasswordError','Weak password.');
        hasError = true;
    }

    if (hasError) return;

    const storedEmail = localStorage.getItem('user_email');
    const storedPassword = localStorage.getItem('user_password');

    if (!storedEmail || !storedPassword) {
        showError('loginEmail','loginEmailError','Signup first.');
        return;
    }

    if (email !== storedEmail || password !== storedPassword) {
        showError('loginEmail','loginEmailError','Invalid credentials.');
        return;
    }

    showToast('Logged in successfully!');
    localStorage.setItem('isLoggedIn','true');

    setTimeout(() => {
        window.location.href = "../html/dashboard.html";
    }, 1000);

    resetLoginForm();
}

function resetLoginForm() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    clearAllErrors();
}