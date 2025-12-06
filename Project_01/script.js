document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const formSwitcherLinks = document.querySelectorAll('.switch-form');
    const visualNavSignUp = document.getElementById('nav-sign-up');
    const formPanel = document.querySelector('.form-panel'); // இங்கே form-panel-ஐப் பெறுகிறோம்

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    const switchForm = (targetForm) => {
        const loginContent = document.getElementById('login-form-content');
        const signupContent = document.getElementById('signup-form-content');

        if (targetForm === 'signup') {
            loginContent.classList.remove('active');
            signupContent.classList.add('active');
            formPanel.style.overflowY = 'auto';
        } else {
            signupContent.classList.remove('active');
            loginContent.classList.add('active');
            formPanel.style.overflowY = 'hidden';
        }
    };
    switchForm('login'); 

    formSwitcherLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const target = link.getAttribute('data-target');
            switchForm(target);
        });
    });

    visualNavSignUp.addEventListener('click', (event) => {
        event.preventDefault();
        switchForm('signup');
        visualNavSignUp.style.display = 'none';
    });

    const handleSubmit = (event, type) => {
        event.preventDefault();
        
        let message;
        if (type === 'Login') {
            const email = document.getElementById('login-email').value;
            message = `Login Successful!\nEmail: ${email}`;
        } else {
            const name = document.getElementById('signup-name').value;
            message = `Sign Up Successful!\nWelcome, ${name}!`;
        }

        alert(message);
        
        window.location.reload();
    };

    loginForm.addEventListener('submit', (event) => handleSubmit(event, 'Login'));
    signupForm.addEventListener('submit', (event) => handleSubmit(event, 'Sign Up'));


    prevBtn.addEventListener('click', () => {
        console.log('Previous button clicked');
    });

    nextBtn.addEventListener('click', () => {
        console.log('Next button clicked');
    });
});