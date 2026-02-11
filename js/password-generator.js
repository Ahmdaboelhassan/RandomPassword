// Password Generator Module

class PasswordGenerator {
    constructor() {
        this.uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.lowercase = 'abcdefghijklmnopqrstuvwxyz';
        this.numbers = '0123456789';
        this.special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    generate(options) {
        const {
            length = 16,
            includeUppercase = true,
            includeLowercase = true,
            includeNumbers = true,
            includeSpecial = true
        } = options;

        // Validate that at least one character type is selected
        if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSpecial) {
            throw new Error('Please select at least one character type');
        }

        // Build character pool
        let characters = '';
        const guaranteedChars = [];

        if (includeUppercase) {
            characters += this.uppercase;
            guaranteedChars.push(this.getRandomChar(this.uppercase));
        }
        if (includeLowercase) {
            characters += this.lowercase;
            guaranteedChars.push(this.getRandomChar(this.lowercase));
        }
        if (includeNumbers) {
            characters += this.numbers;
            guaranteedChars.push(this.getRandomChar(this.numbers));
        }
        if (includeSpecial) {
            characters += this.special;
            guaranteedChars.push(this.getRandomChar(this.special));
        }

        // Generate password
        let password = '';
        
        // First, add guaranteed characters to ensure each selected type is included
        for (const char of guaranteedChars) {
            password += char;
        }

        // Fill the rest of the password length with random characters
        for (let i = password.length; i < length; i++) {
            password += this.getRandomChar(characters);
        }

        // Shuffle the password to randomize the guaranteed characters positions
        password = this.shuffleString(password);

        return password;
    }

    getRandomChar(str) {
        // Use crypto.getRandomValues for better randomness
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return str[array[0] % str.length];
    }

    shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const randomValues = new Uint32Array(1);
            crypto.getRandomValues(randomValues);
            const j = randomValues[0] % (i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    calculateStrength(password, options) {
        let score = 0;
        const length = password.length;

        // Length score (0-40 points)
        if (length >= 16) score += 40;
        else if (length >= 12) score += 30;
        else if (length >= 8) score += 20;
        else score += 10;

        // Character variety score (0-40 points)
        let varietyScore = 0;
        if (options.includeUppercase) varietyScore += 10;
        if (options.includeLowercase) varietyScore += 10;
        if (options.includeNumbers) varietyScore += 10;
        if (options.includeSpecial) varietyScore += 10;
        score += varietyScore;

        // Complexity score (0-20 points)
        const uniqueChars = new Set(password).size;
        if (uniqueChars >= length * 0.8) score += 20;
        else if (uniqueChars >= length * 0.6) score += 15;
        else if (uniqueChars >= length * 0.4) score += 10;
        else score += 5;

        // Convert score to strength level
        if (score >= 85) return { level: 'strong', text: 'Strong 💪', class: 'strong' };
        if (score >= 65) return { level: 'good', text: 'Good 👍', class: 'good' };
        if (score >= 45) return { level: 'fair', text: 'Fair 😐', class: 'fair' };
        return { level: 'weak', text: 'Weak 😟', class: 'weak' };
    }
}

// Password Generator UI Controller
class PasswordGeneratorUI {
    constructor(app) {
        this.app = app;
        this.generator = new PasswordGenerator();
        this.initElements();
        this.attachEventListeners();
    }

    initElements() {
        // Modal elements
        this.modal = document.getElementById('passwordModal');
        this.closeModalBtn = document.getElementById('closeModal');
        this.generatePasswordBtn = document.getElementById('generatePasswordBtn');
        
        // Generation elements
        this.generatedPasswordInput = document.getElementById('generatedPassword');
        this.generateBtn = document.getElementById('generateBtn');
        this.usePasswordBtn = document.getElementById('usePasswordBtn');
        this.copyGeneratedPasswordBtn = document.getElementById('copyGeneratedPassword');
        
        // Options
        this.lengthSlider = document.getElementById('passwordLength');
        this.lengthValue = document.getElementById('lengthValue');
        this.uppercaseCheckbox = document.getElementById('includeUppercase');
        this.lowercaseCheckbox = document.getElementById('includeLowercase');
        this.numbersCheckbox = document.getElementById('includeNumbers');
        this.specialCheckbox = document.getElementById('includeSpecial');
        
        // Strength indicator
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
    }

    attachEventListeners() {
        // Modal controls
        this.generatePasswordBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        
        // Click outside modal to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
        
        // Password generation
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.usePasswordBtn.addEventListener('click', () => this.usePassword());
        this.copyGeneratedPasswordBtn.addEventListener('click', () => this.copyGeneratedPassword());
        
        // Length slider
        this.lengthSlider.addEventListener('input', () => {
            this.lengthValue.textContent = this.lengthSlider.value;
            if (this.generatedPasswordInput.value) {
                this.generatePassword();
            }
        });
        
        // Checkbox changes
        [this.uppercaseCheckbox, this.lowercaseCheckbox, 
         this.numbersCheckbox, this.specialCheckbox].forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (this.generatedPasswordInput.value) {
                    this.generatePassword();
                }
            });
        });
    }

    openModal() {
        this.modal.classList.add('show');
        // Generate a password immediately when opening
        this.generatePassword();
    }

    closeModal() {
        this.modal.classList.remove('show');
    }

    getOptions() {
        return {
            length: parseInt(this.lengthSlider.value),
            includeUppercase: this.uppercaseCheckbox.checked,
            includeLowercase: this.lowercaseCheckbox.checked,
            includeNumbers: this.numbersCheckbox.checked,
            includeSpecial: this.specialCheckbox.checked
        };
    }

    generatePassword() {
        try {
            const options = this.getOptions();
            const password = this.generator.generate(options);
            
            this.generatedPasswordInput.value = password;
            this.updateStrength(password, options);
        } catch (error) {
            this.app.showToast(error.message, 'error');
        }
    }

    updateStrength(password, options) {
        const strength = this.generator.calculateStrength(password, options);
        
        // Remove all strength classes
        this.strengthFill.className = 'strength-fill';
        this.strengthText.className = 'strength-text';
        
        // Add new strength class
        this.strengthFill.classList.add(strength.class);
        this.strengthText.classList.add(strength.class);
        this.strengthText.textContent = strength.text;
    }

    usePassword() {
        const password = this.generatedPasswordInput.value;
        
        if (!password) {
            this.app.showToast('Please generate a password first', 'error');
            return;
        }
        
        // Set the password in the encryption key field
        this.app.encryptionKey.value = password;
        this.app.encryptionKey.type = 'text'; // Show it briefly
        
        this.app.showToast('Password applied to encryption key!', 'success');
        this.closeModal();
        
        // Hide password after 2 seconds
        setTimeout(() => {
            if (this.app.encryptionKey.value === password) {
                this.app.encryptionKey.type = 'password';
            }
        }, 2000);
    }

    async copyGeneratedPassword() {
        const password = this.generatedPasswordInput.value;
        
        if (!password) {
            this.app.showToast('Please generate a password first', 'error');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(password);
            this.app.showToast('Password copied to clipboard!', 'success');
            
            // Visual feedback
            const originalText = this.copyGeneratedPasswordBtn.textContent;
            this.copyGeneratedPasswordBtn.textContent = '✓';
            setTimeout(() => {
                this.copyGeneratedPasswordBtn.textContent = originalText;
            }, 2000);
        } catch (error) {
            // Fallback
            this.generatedPasswordInput.select();
            document.execCommand('copy');
            this.app.showToast('Password copied to clipboard!', 'success');
        }
    }
}
