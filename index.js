
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const dobInput = document.getElementById('dob');
    const termsCheckbox = document.getElementById('terms');
    
    // Password strength indicators
    const lengthIndicator = document.getElementById('lengthIndicator');
    const mixedCaseIndicator = document.getElementById('mixedCaseIndicator');
    const numberIndicator = document.getElementById('numberIndicator');
    
    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const dobError = document.getElementById('dobError');
    const termsError = document.getElementById('termsError');
    const formSuccess = document.getElementById('formSuccess');

    // Table elements
    const registeredUsersSection = document.getElementById('registeredUsersSection');
    const userTableBody = document.getElementById('userTableBody');
    const clearDataSection = document.getElementById('clearDataSection');
    const clearAllDataBtn = document.getElementById('clearAllData');
    
    // Real-time password validation
    passwordInput.addEventListener('input', validatePassword);
    
    function validatePassword() {
    const password = passwordInput.value;
    
    // Check password length
    if (password.length >= 8) {
        lengthIndicator.classList.remove('bg-gray-300');
        lengthIndicator.classList.add('bg-green-500');
    } else {
        lengthIndicator.classList.remove('bg-green-500');
        lengthIndicator.classList.add('bg-gray-300');
    }
    
    // Check for mixed case
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        mixedCaseIndicator.classList.remove('bg-gray-300');
        mixedCaseIndicator.classList.add('bg-green-500');
    } else {
        mixedCaseIndicator.classList.remove('bg-green-500');
        mixedCaseIndicator.classList.add('bg-gray-300');
    }
    
    // Check for numbers
    if (/\d/.test(password)) {
        numberIndicator.classList.remove('bg-gray-300');
        numberIndicator.classList.add('bg-green-500');
    } else {
        numberIndicator.classList.remove('bg-green-500');
        numberIndicator.classList.add('bg-gray-300');
    }
    }

    // Load existing data from localStorage
    loadUserData();
    
    // Form submission handler
    form.addEventListener('submit', function(event) {
    event.preventDefault();
    let isValid = true;
    
    // Reset all error messages
    [nameError, emailError, passwordError, dobError, termsError].forEach(el => el.classList.add('hidden'));
    
    // Validate name
    if (!nameInput.value.trim()) {
        nameError.classList.remove('hidden');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailError.classList.remove('hidden');
        isValid = false;
    }
    
    // Validate password
    const password = passwordInput.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        passwordError.classList.remove('hidden');
        isValid = false;
    }
    
    // Validate date of birth
    if (dobInput.value) {
        const dob = new Date(dobInput.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
        }
        
        if (age < 18 || age > 55) {
        dobError.classList.remove('hidden');
        isValid = false;
        }
    } else {
        dobError.textContent = "Please enter your date of birth";
        dobError.classList.remove('hidden');
        isValid = false;
    }


    // Validate terms and conditions
    if (!termsCheckbox.checked) {
        termsError.classList.remove('hidden');
        isValid = false;
    }
    
    
    // If all validations pass
    if (isValid) {
        // Save user data to localStorage
        saveUserData({
        id: generateUserId(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        dob: dobInput.value,
        acceptedTerms: termsCheckbox.checked,
        password: passwordInput.value,
        });
        
        // Show success message
        formSuccess.classList.remove('hidden');
        
        // Reset form after 2 seconds
        setTimeout(() => {
        form.reset();
        formSuccess.classList.add('hidden');
        // Reset password indicators
        [lengthIndicator, mixedCaseIndicator, numberIndicator].forEach(el => {
            el.classList.remove('bg-green-500');
            el.classList.add('bg-gray-300');
        });
        }, 2000);
    }
    });

    // Clear all data button handler
    clearAllDataBtn.addEventListener('click', function() {
    if (confirm("Are you sure you want to delete all user data?")) {
        localStorage.removeItem('userData');
        loadUserData(); // Refresh the table (which will now be empty)
    }
    });

    // Generate a unique ID for each user
    function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Save user data to localStorage
    function saveUserData(userData) {
    let existingData = JSON.parse(localStorage.getItem('userData')) || [];
    existingData.push(userData);
    localStorage.setItem('userData', JSON.stringify(existingData));
    loadUserData(); // Refresh the table with the new data
    }

    // Delete a specific user entry
    function deleteUserData(userId) {
    let existingData = JSON.parse(localStorage.getItem('userData')) || [];
    existingData = existingData.filter(user => user.id !== userId);
    localStorage.setItem('userData', JSON.stringify(existingData));
    loadUserData(); // Refresh the table
    }

    // Load and display user data from localStorage
    function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || [];
    
    
    // Clear existing table rows
    userTableBody.innerHTML = '';
    
    // Add rows for each user
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
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
        const userId = this.getAttribute('data-user-id');
        if (confirm("Are you sure you want to delete this user?")) {
            deleteUserData(userId);
        }
        });
    });
    }
});
