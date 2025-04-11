const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuCloseBtn = document.querySelector('.menu .close');
const slide1 = document.getElementById('slide1');
const slide2 = document.getElementById('slide2');
const leftButton = document.getElementById('left-arrow');
const rightButton = document.getElementById('right-arrow');
var currentSlideIdx = 0;
const sldies = [slide1, slide2];
var currentSlide = sldies[currentSlideIdx];

console.log(slide1);
console.log(slide2);
console.log(currentSlide);


currentSlide.classList.add('slide-visible');

menuBtn.addEventListener('click', ()=>{
    console.log(menu);
    console.log(menuBtn);
    
    menu.classList.add('menu-visible');
})

menuCloseBtn.addEventListener('click', ()=>{
    menu.classList.remove('menu-visible');
})

document.getElementById("right-arrow").addEventListener("click", function () {
    document.querySelector(".parteners").scrollBy({
        left: 300, // Change value to control scroll amount
        behavior: "smooth"
    });
});

document.getElementById("left-arrow").addEventListener("click", function () {
    document.querySelector(".parteners").scrollBy({
        left: -300, // Change value to control scroll amount
        behavior: "smooth"
    });
});