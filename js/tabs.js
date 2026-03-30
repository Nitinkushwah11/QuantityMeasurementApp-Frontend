function switchTab(tab) {
    const loginTab    = document.getElementById('loginTab');
    const signupTab   = document.getElementById('signupTab');
    const loginForm   = document.getElementById('loginForm');
    const signupForm  = document.getElementById('signupForm');

    loginTab.classList.remove('active');
    signupTab.classList.remove('active');
    loginForm.classList.remove('active');
    signupForm.classList.remove('active');

    if (tab === 'login') {
        loginTab.classList.add('active');
        loginForm.classList.add('active');
    } else {
        signupTab.classList.add('active');
        signupForm.classList.add('active');
    }

    clearAllErrors();
}