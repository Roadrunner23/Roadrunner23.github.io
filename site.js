document.addEventListener('DOMContentLoaded', async function() {
    // Creates cards for the Carousel
    // Gets corrosponding JSON data for each file
    await fetch('projects.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();  
    })
    .then(data => {
        const carousel = document.querySelector('#Carousel');
        for (let i = 0; i < Object.keys(data).length; i++) {
            // Create card
            let card = document.createElement('div');
            card.classList.add('card');

            // Set elements in card
            let name = document.createElement('h3');
            name.innerHTML = data[i].name;

            let image = document.createElement('img');
            image.src = `images/${data[i].src}.jpg`;
            image.setAttribute("data-vsrc", `videos/${data[i].vsrc}.mp4`);

            let description = document.createElement('p');
            description.innerHTML = data[i].descShort;
            description.setAttribute("data-long", data[i].descLong)

            let button = document.createElement('button');
            button.textContent = 'View More';
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-controls", "description");

            // Put it all together
            card.append(name, image, description, button);
            carousel.appendChild(card);
        }
    })  
    .catch(error => console.error('Failed to fetch data:', error));

    // Gathers elements
    const cards = Array.from(document.querySelectorAll('.card'));
    const buttons = document.querySelectorAll('button');
    const description = document.querySelector('#description');

    // helper function for resizing cards
    function fitCards() {
        maxCard = 0;
        cards.forEach(card => {
            card.style.height = "auto";
            maxCard = Math.max(maxCard, card.getBoundingClientRect().height);
        });
        cards.forEach(card => {
            card.style.height = `${maxCard}px`;
        });
    }

    // Helper function for resizing description image/video
    function fitImg() {
        let w = description.querySelector('img').naturalWidth;
        let h = description.querySelector('img').naturalHeight;

        if (window.innerWidth <= (w/h) * 600) {
            document.querySelector('#project').style.flexDirection = "column";
            description.querySelector('img').style.maxWidth = "90%";
            description.querySelector('video').style.maxWidth = "90%";
        } else {
            document.querySelector('#project').style.flexDirection = "row";
            description.querySelector('img').style.maxWidth = "50%";
            description.querySelector('video').style.maxWidth = "50%";
        }
    }

    window.addEventListener("load", fitCards)
    
    const observer = new ResizeObserver(() => {
        fitCards();
        fitImg();
    });

    cards.forEach(card => observer.observe(card));


    // Disable all buttons
    function disableButtons() {
        buttons.forEach(btn => btn.disabled = true);
    }

    // Enable all buttons
    function enableButtons() {
        buttons.forEach(btn => btn.disabled = false);
    }

    // When collapse starts animating (opening or closing)
    description.addEventListener('show.bs.collapse', disableButtons);
    description.addEventListener('hide.bs.collapse', disableButtons);

    // When collapse finishes animating (fully opened or closed)
    description.addEventListener('shown.bs.collapse', enableButtons);
    description.addEventListener('hidden.bs.collapse', enableButtons);

    const bsCollapse = new bootstrap.Collapse(description, {
        toggle: false
    })

    currentButton = null;
    
    buttons.forEach(button => {
        button.addEventListener("click", () => {

            let open = description.classList.contains('show');

            let img = description.querySelector('img')

            if (open && currentButton === button) {
                bsCollapse.hide();
                currentButton = null;
                return;
            } else if (open) {
                currentButton = button;
                bsCollapse.hide()
                description.addEventListener('hidden.bs.collapse', () => {
                    switcheroo(button);
                    img.addEventListener("load", () => {
                        fitImg();
                        bsCollapse.show();
                    }, { once: true });
                }, { once: true });
            } else {
                currentButton = button;
                switcheroo(button);
                img.addEventListener("load", () => {
                    fitImg();
                    bsCollapse.show();
                }, { once: true });
            }
        });
    })

    // Helper function for previous function
    function switcheroo(button) {
        description.querySelector('h2').innerHTML = button.parentElement.querySelector('h3').innerHTML;
        description.querySelector('p').innerHTML = button.parentElement.querySelector('p').getAttribute("data-long");

        const img = description.querySelector('img');
        const video = description.querySelector('video');

        video.style.display = "none";
        video.pause();
        video.removeAttribute("src");
        img.style.display = "block";

        img.src = button.parentElement.querySelector('img').src;
        video.src = button.parentElement.querySelector('img').getAttribute('data-vsrc');
        video.preload = "auto";

        video.addEventListener("canplaythrough", () => {
            img.style.display = "none";
            video.style.display = "block";
            video.play(); 
        }, { once: true });

        video.load();
    }

    // Store initial positions of each card
    const positions = cards.map((card, i) => i * 5);
    let running = true;
    let lastTime = performance.now();

    // Helper function to reset cards while resizing
    function resetPositions() {
        let leftMost = Math.min(...positions);
        cards.forEach((card, i) => {
            positions[i] = (i * 5) + leftMost;
            card.style.transform = `translateX(${positions[i]}px)`;
        });
    }

    // Helper function to shove cards to the back of the line
    function sendRight(card, i) {
        let rightMost = Math.max(...cards.map(c => c.getBoundingClientRect().right));
            // Move this card just after the rightmost one
        positions[i] += 15 + rightMost - card.getBoundingClientRect().left;
    }

    window.addEventListener("resize", resetPositions);

    function move() {

        if (!running) {
            requestAnimationFrame(move);
            return;
        }

        let tempPos = []
        cards.forEach((card, i) => {
            let currentPos = card.getBoundingClientRect().left;
            tempPos.forEach(pos => {
                if (pos - 10 < currentPos && currentPos < pos + 10) {
                    sendRight(card, i);
                }
            })
            tempPos.push(currentPos);
        }) 

        let now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        cards.forEach((card, i) => {
            // Move each card left
            positions[i] -= (window.innerWidth / 12) * delta; // adjust speed here
            card.style.transform = `translateX(${positions[i]}px)`;

            // If card is completely offscreen to the left
            const cardRight = card.getBoundingClientRect().right;
            if (cardRight < -5) {
                // Find the rightmost card
                sendRight(card, i);
            }
        });

        requestAnimationFrame(move);
    }

    move();

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            running = false;
        } else {
            running = true;
            lastTime = performance.now(); // reset so delta doesn't explode
        }
    });
});
