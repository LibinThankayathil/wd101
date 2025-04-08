document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');
    const termsCheckbox = document.getElementById('terms');
    const email = document.getElementById('email');
    const dob = document.getElementById('dob');

    const lengthIndicator = document.getElementById('lengthIndicator');
    const mixedCaseIndicator = document.getElementById('mixedCaseIndicator');
    const numberIndicator = document.getElementById('numberIndicator');

    const nameError = document.getElementById('nameError');
    const passwordError = document.getElementById('passwordError');
    const termsError = document.getElementById('termsError');
    const formSuccess = document.getElementById('formSuccess');

    const registeredUsersSection = document.getElementById('registeredUsersSection');
    const userTableBody = document.getElementById('userTableBody');
    const clearDataSection = document.getElementById('clearDataSection');
    const clearAllDataBtn = document.getElementById('clearAllData');

    // Validate Email
    email.addEventListener('input', () => validate(email));
    function validate(element) {
        if (element.validity.typeMismatch) {
            element.setCustomValidity("The Email is not in the right format!!!");
            element.reportValidity();
            return false;
        } else {
            element.setCustomValidity('');
            return true;
        }
    }

    // Validate DOB
    dob.addEventListener('input', () => validateDOB(dob));
    function validateDOB(element) {
        const inputDate = new Date(element.value);
        const today = new Date();

        const minAgeDate = new Date(today.getFullYear() - 55, today.getMonth(), today.getDate());
        const maxAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

        if (inputDate < minAgeDate || inputDate > maxAgeDate) {
            element.setCustomValidity("Age must be between 18 and 55 years.");
            element.reportValidity();
            return false;
        } else {
            element.setCustomValidity('');
            return true;
        }
    }

    // Password strength indicator
    passwordInput.addEventListener('input', validatePassword);
    function validatePassword() {
        const password = passwordInput.value;

        lengthIndicator.classList.toggle('bg-green-500', password.length >= 8);
        lengthIndicator.classList.toggle('bg-gray-300', password.length < 8);

        const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
        mixedCaseIndicator.classList.toggle('bg-green-500', hasMixedCase);
        mixedCaseIndicator.classList.toggle('bg-gray-300', !hasMixedCase);

        const hasNumber = /\d/.test(password);
        numberIndicator.classList.toggle('bg-green-500', hasNumber);
        numberIndicator.classList.toggle('bg-gray-300', !hasNumber);
    }

    loadUserData(); // Load data initially

    // Handle Form Submit
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let isValid = true;

        [nameError, emailError, dobError, passwordError, termsError].forEach(el => el.classList.add('hidden'));

        if (!validate(email)) {
            email.setCustomValidity("The Email is not in the right format!!!");
            email.reportValidity();
            isValid = false;
        } else {
            email.setCustomValidity('');
        }
  
  
        if (!validateDOB(dob)) {
            dob.setCustomValidity("Age must be between 18 and 55 years.");
            dob.reportValidity();
            isValid = false;
        } else {
            dob.setCustomValidity('');
        }

        if (!nameInput.value.trim()) {
            nameError.classList.remove('hidden');
            isValid = false;
        }

        const password = passwordInput.value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            passwordError.classList.remove('hidden');
            isValid = false;
        }

        if (!termsCheckbox.checked) {
            termsError.classList.remove('hidden');
            isValid = false;
        }

        if (isValid) {
            saveUserData({
                id: generateUserId(),
                name: nameInput.value.trim(),
                email: email.value.trim(),
                dob: dob.value.trim(),
                acceptedTerms: termsCheckbox.checked,
                password: passwordInput.value,
            });

            formSuccess.classList.remove('hidden');

            setTimeout(() => {
                form.reset();
                formSuccess.classList.add('hidden');

                [lengthIndicator, mixedCaseIndicator, numberIndicator].forEach(el => {
                    el.classList.remove('bg-green-500');
                    el.classList.add('bg-gray-300');
                });
            }, 2000);
        }
    });

    clearAllDataBtn.addEventListener('click', function () {
        if (confirm("Are you sure you want to delete all user data?")) {
            localStorage.removeItem('userData');
            loadUserData();
        }
    });

    function generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function saveUserData(userData) {
        let existingData = JSON.parse(localStorage.getItem('userData')) || [];
        existingData.push(userData);
        localStorage.setItem('userData', JSON.stringify(existingData));
        loadUserData();
    }

    function deleteUserData(userId) {
        let existingData = JSON.parse(localStorage.getItem('userData')) || [];
        existingData = existingData.filter(user => user.id !== userId);
        localStorage.setItem('userData', JSON.stringify(existingData));
        loadUserData();
    }

    function loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData')) || [];
        userTableBody.innerHTML = '';

        userData.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-2 px-4 border-b border-gray-200">${user.name}</td>
                <td class="py-2 px-4 border-b border-gray-200">${user.email}</td>
                <td class="py-2 px-4 border-b border-gray-200">${user.password}</td>
                <td class="py-2 px-4 border-b border-gray-200">${user.dob}</td>
                <td class="py-2 px-4 border-b border-gray-200">${user.acceptedTerms}</td>
                <td class="py-2 px-4 border-b border-gray-200">
                    <button class="delete-btn text-red-600 hover:text-red-800" data-user-id="${user.id}">
                        Delete
                    </button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const userId = this.getAttribute('data-user-id');
                if (confirm("Are you sure you want to delete this user?")) {
                    deleteUserData(userId);
                }
            });
        });
    }
});
