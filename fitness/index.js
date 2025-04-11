const menuBtn = document.querySelector('.menu-btn');
const menuContainer = document.querySelector('.menu-container');
const profiles = document.querySelectorAll('.profile')
const packages = document.querySelectorAll('.package')
const sports = document.querySelectorAll('.sport')
menuBtn.addEventListener('click', ()=>{
    menuContainer.classList.toggle('hidden');
})

/* Animation */
/*const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.5 });

profiles.forEach(box => observer.observe(box));
packages.forEach(box => observer.observe(box));
sports.forEach(box => observer.observe(box));*/