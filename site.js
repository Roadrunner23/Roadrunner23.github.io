document.addEventListener('DOMContentLoaded', function() {

    window.mainpage = document.querySelector('#mainpage');

    window.projectpage = document.querySelector('#projectpage');
    projectpage.style.display = 'none';

    // Sets up the return anchor
    const goBack = document.querySelector('#return');
    goBack.addEventListener('click', () => {

        document.body.scrollTop = 0;

        const desc = document.querySelector('.description');
        desc.firstElementChild.style.display = 'block';

        goBack.style.display = 'none';

        mainpage.style.display = 'inline';
        projectpage.style.display = 'none';
    })

    // Sets up the bootstrap accordions under the "Projects" heading of index.
    ProjectAnimationSetup();

    document.querySelectorAll('.projectlink').forEach((a) => {
        a.addEventListener('click', () => {
            
            document.body.scrollTop = 0;

            const card = a.parentElement;
            const button = a.parentElement.parentElement.parentElement.firstElementChild;

            PageSetup(button, card);
        })
    })
});

function PageSetup(button, card) {
    mainpage.style.display = 'none';
    projectpage.style.display = 'inline';

    const desc = document.querySelector('.description');
    desc.firstElementChild.style.display = 'none';

    const goBack = document.querySelector('#return');
    goBack.style.display = 'block';

    var name = button.firstElementChild.innerHTML;
    if (name.slice(0, 3) == '<u>') {
        name = name.slice(3, -4);
    }
}

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