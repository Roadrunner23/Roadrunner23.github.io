document.addEventListener('DOMContentLoaded', function() {
    // Sets up the bootstrap accordions under the "Projects" heading of index.
    ProjectAnimationSetup();
});

function ProjectAnimationSetup() {
    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => {
            if (button.getAttribute('aria-expanded') == 'true') {
                button.style.animationDuration = '0.01s';
                button.classList.remove('radiusout');
                button.classList.add('radiusin');
            } else {
                button.style.animationDuration = '1s';
                button.classList.remove('radiusin');
                button.classList.add('radiusout');
            }
        })
    })
}