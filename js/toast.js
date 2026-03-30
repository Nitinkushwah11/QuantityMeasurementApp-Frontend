let toastTimer = null;

function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.className = 'toast';
    toast.textContent = message;

    void toast.offsetWidth;

    toast.classList.add('show', type);

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}