document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const userCountInput = document.getElementById('userCount');
    const nameFormatSelect = document.getElementById('nameFormat');
    const usersContainer = document.getElementById('usersContainer');
    const errorMessage = document.getElementById('errorMessage');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const usersTable = document.getElementById('usersTable');
    
    // Function to fetch users from the API
    async function fetchUsers(count) {
        if (count < 0 || count > 1000) {
            showError('Please enter a number between 0 and 1000');
            return;
        }
        
        // Show loading indicator
        loadingIndicator.classList.remove('d-none');
        usersContainer.innerHTML = '';
        usersTable.classList.add('d-none');
        hideError();
        
        try {
            const response = await fetch(`https://randomuser.me/api/?results=${count}`);
            
            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }
            
            const data = await response.json();
            displayUsers(data.results);
        } catch (err) {
            showError(`Failed to fetch users: ${err.message}. Please try again.`);
        } finally {
            loadingIndicator.classList.add('d-none');
        }
    }
    
    // Function to display users in a table
    function displayUsers(users) {
        usersContainer.innerHTML = '';
        
        if (users.length === 0) {
            usersContainer.innerHTML = '<tr><td colspan="4" class="text-center">No users to display. Try generating some users.</td></tr>';
            usersTable.classList.remove('d-none');
            return;
        }
        
        const nameFormat = nameFormatSelect.value;
        
        users.forEach(user => {
            let displayName;
            if (nameFormat === 'first') {
                displayName = user.name.first;
            } else if (nameFormat === 'last') {
                displayName = user.name.last;
            } else {
                displayName = `${user.name.first} ${user.name.last}`;
            }
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${displayName}</td>
                <td>${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</td>
                <td>${user.email}</td>
                <td>${user.location.country}</td>
            `;
            
            usersContainer.appendChild(row);
        });
        
        usersTable.classList.remove('d-none');
    }
    
    // Function to show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('d-none');
    }
    
    // Function to hide error message
    function hideError() {
        errorMessage.classList.add('d-none');
    }
    
    // Event listeners
    generateBtn.addEventListener('click', function() {
        const count = parseInt(userCountInput.value);
        fetchUsers(count);
    });
    
    nameFormatSelect.addEventListener('change', function() {
        const count = parseInt(userCountInput.value);
        if (count > 0) {
            fetchUsers(count);
        }
    });
    
    // Initial load with empty container
    displayUsers([]);
});