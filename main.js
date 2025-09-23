document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.dropdown-content a');
    const sections = document.querySelectorAll('.content-section');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.hasAttribute('href') && button.getAttribute('href') !== '#') {
                return;
            } else {
                e.preventDefault();
                const sectionId = button.getAttribute('data-section');
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            }
        });
    });

    // Show first section by default
    document.getElementById('quotes').classList.add('active');
});