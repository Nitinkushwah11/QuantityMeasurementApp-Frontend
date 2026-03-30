function handleSignup() {
    clearAllErrors();

    const fullName = document.getElementById('fullName').value.trim();
    const email    = document.getElementById('emailId').value.trim();
    const password = document.getElementById('password').value;
    const mobile   = document.getElementById('mobile').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value;

    let hasError = false;

    if (!fullName) {
        showError('fullName','fullNameError','Full name is required.');
        hasError = true;
    } else if (fullName.length < 2) {
        showError('fullName','fullNameError','Name must be at least 2 characters.');
        hasError = true;
    }

    if (!email) {
        showError('emailId','emailIdError','Email is required.');
        hasError = true;
    } else if (!isValidEmail(email)) {
        showError('emailId','emailIdError','Invalid email.');
        hasError = true;
    }

    if (!password) {
        showError('password','passwordError','Password required.');
        hasError = true;
    } else if (!isStrongPassword(password)) {
        showError('password','passwordError','Weak password.');
        hasError = true;
    }

    if (!mobile) {
        showError('mobile','mobileError','Mobile required.');
        hasError = true;
    } else if (!isValidMobile(mobile)) {
        showError('mobile','mobileError','Invalid mobile.');
        hasError = true;
    }

    if (!confirmPassword) {
        showError('confirmPassword','confirmPasswordError','Confirm password.');
        hasError = true;
    } else if (password !== confirmPassword) {
        showError('confirmPassword','confirmPasswordError','Passwords not match.');
        hasError = true;
    }

    if (hasError) return;

    localStorage.setItem('user_email', email);
    localStorage.setItem('user_password', password);

    showToast('Account created successfully!');
    resetSignupForm();
}

function resetSignupForm() {
    document.getElementById('fullName').value = '';
    document.getElementById('emailId').value = '';
    document.getElementById('password').value = '';
    document.getElementById('mobile').value = '';
    document.getElementById('confirmPassword').value = '';
    clearAllErrors();
}