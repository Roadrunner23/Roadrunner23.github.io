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

        desc.style.backgroundColor = 'cadetblue';
        desc.style.border = '10px double rgb(42, 69, 70)';

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

            const projectTitle = projectpage.firstElementChild;
            const projectBody = projectpage.lastElementChild;

            projectTitle.style.backgroundColor = button.style.backgroundColor;
            projectBody.style.backgroundColor = card.style.backgroundColor;

            projectTitle.firstElementChild.innerHTML = button.firstElementChild.innerHTML;

            if (card.parentElement.id != 'project0') { 
                projectBody.querySelector('img').src = card.querySelector('img').src;
                if (projectBody.firstElementChild.nodeName.toLowerCase() != 'img') {
                    projectBody.querySelector('img').style.display = 'inline';
                    document.querySelector('#specialtext').remove();
                }
            } else if (projectBody.firstElementChild.nodeName.toLowerCase() == 'img') {
                const specialtext = document.createElement('h3');
                specialtext.innerHTML = "No need for a GIF, you're looking at it!";
                specialtext.setAttribute('id', 'specialtext');
                projectBody.insertBefore(specialtext, projectBody.firstChild);
                projectBody.querySelector('img').style.display = 'none';
            }

            projectBody.querySelector('p').innerHTML = card.querySelector('.projectdescription').innerHTML;

            PageSetup(button, card);
        })
    })
});

function PageSetup(button, card) {
    mainpage.style.display = 'none';
    projectpage.style.display = 'inline';

    const desc = document.querySelector('.description');
    desc.firstElementChild.style.display = 'none';

    desc.style.backgroundColor = 'rgb(50,50,50)';
    desc.style.border = '10px double dodgerblue';

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
                button.style.animationDuration = '2s';
                button.classList.remove('radiusin');
                button.classList.add('radiusout');
            }
        })
    })
}