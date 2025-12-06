document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const formSwitcherLinks = document.querySelectorAll('.switch-form');
    
    const loginContent = document.getElementById('login-content');
    const signupContent = document.getElementById('signup-content');

    const googleLoginBtn = document.querySelectorAll('.google-login-btn');
    const forgotPasswordLink = document.querySelector('.forgot-password-link');
    const learnMoreBtn = document.querySelector('.learn-more-btn');

    const switchForm = (target) => {
        if (target === 'signup') {
            // Login (Current) -> Sign Up (Target) : Right to Left Slide (Form moves out to the left, new form slides in from the right)
            loginContent.classList.remove('active');
            loginContent.classList.add('to-right'); // Form moves out
            signupContent.classList.remove('to-left'); // New class not needed in this simpler structure, but keeping for consistency if complex structure is revisited
            signupContent.classList.add('from-left'); 
            
            // Wait for the exit animation to start, then make the new form active
            setTimeout(() => {
                loginContent.classList.remove('to-right');
                signupContent.classList.add('active'); // New form appears/slides in
            }, 50);

        } else {
            // Sign Up (Current) -> Login (Target) : Left to Right Slide (Form moves out to the right, new form slides in from the left)
            signupContent.classList.remove('active');
            signupContent.classList.add('to-left'); // Form moves out
            
            // Wait for the exit animation to start, then make the new form active
            setTimeout(() => {
                signupContent.classList.remove('from-left');
                loginContent.classList.add('active'); // New form appears/slides in
            }, 50);
        }
    };
    
    // Initial setup
    switchForm('login');

    formSwitcherLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const target = link.getAttribute('data-target');
            switchForm(target);
        });
    });

    const handleSubmit = (event, type) => {
        event.preventDefault();
        
        let message;
        if (type === 'Login') {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (email && password) {
                message = `Login successful for KIMEONE!\nEmail: ${email}`;
            } else {
                 message = `Please fill out all fields for Login.`;
            }
            
        } else { // Sign Up
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            
            if (name && email) {
                message = `Sign Up successful! Welcome to KIMEONE, ${name}.`;
                signupForm.reset();
                switchForm('login'); 
            } else {
                message = `Please fill out all fields for Sign Up.`;
            }
        }

        alert(message);
    };

    loginForm.addEventListener('submit', (event) => handleSubmit(event, 'Login'));
    signupForm.addEventListener('submit', (event) => handleSubmit(event, 'Sign Up'));

    // Other button alerts
    googleLoginBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Redirecting to Google for KIMEONE authentication...');
        });
    });

    forgotPasswordLink.addEventListener('click', (event) => {
        event.preventDefault();
        alert('Forgot Password link clicked. Check your email for reset instructions.');
    });
    
    learnMoreBtn.addEventListener('click', (event) => {
        event.preventDefault();
        alert('Learn More button clicked. Showing update details for KIMEONE.');
    });
});