function isValidEmail(stringToTest) {
    const emailRegex = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_'+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
    return emailRegex.test(stringToTest);
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const checkboxes = document.querySelectorAll('input[name="role"]');
    const checkboxError = document.getElementById('checkboxError');

    form.addEventListener('submit', function(event) {
        // Clear previous errors
        emailError.textContent = '';
        emailInput.removeAttribute('aria-invalid');
        emailInput.removeAttribute('aria-describedby');
        checkboxError.textContent = '';
        checkboxes.forEach(checkbox => {
            checkbox.removeAttribute('aria-invalid');
            checkbox.removeAttribute('aria-describedby');
        });

        let isValid = true;

        // Check email
        const emailValue = emailInput.value.trim();
        if (!isValidEmail(emailValue)) {
            emailError.textContent = 'Please enter a valid email address.';
            emailInput.setAttribute('aria-invalid', 'true');
            emailInput.setAttribute('aria-describedby', 'emailError');
            emailInput.focus();
            isValid = false;
        }

        // Check checkboxes
        let atLeastOneChecked = false;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                atLeastOneChecked = true;
            }
        });
        if (!atLeastOneChecked) {
            checkboxError.textContent = 'Please select at least one option.';
            checkboxes.forEach(checkbox => {
                checkbox.setAttribute('aria-invalid', 'true');
                checkbox.setAttribute('aria-describedby', 'checkboxError');
            });
            checkboxes[0].focus();
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        }
        // If valid, allow submission
    });
});