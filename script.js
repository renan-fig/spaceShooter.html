const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const alienImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;
let placar = 0;

//função para movimentar a nave e atirar
function flyShip(event){
    if(event.key === 'ArrowUp'){
        event.preventDefault();
        moveUp();
    } else if(event.key === 'ArrowDown'){
        event.preventDefault();
        moveDown();
    } else if(event.key === " "){
        event.preventDefault();
        fireLaser();
    }
}

//função para subir
function moveUp(){
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top'); //pega a posição vertical do "hero"
    if(topPosition === "0px"){ //limite do movimento dentro da div
        return
    } else{
        let position = parseInt(topPosition); //transforma a posição em Int
        position -= 30;
        yourShip.style.top = `${position}px`; //movimento real do "hero"
    }
}

//função para descer
function moveDown(){
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top'); //pega a posição horizontal do "hero"
    if(topPosition === "510px"){ //limite do movimento dentro da div
        return
    } else{
        let position = parseInt(topPosition); //transforma a posição em Int
        position += 30;
        yourShip.style.top = `${position}px`; //movimento real do "hero"
    }
}

//função de tiro
function fireLaser(){
    let laser = createLaserElement();
    playArea.appendChild(laser); //add o elemento "laser" a div "main-play-area"
    moveLaser(laser);
}
//criando elemento laser
function createLaserElement(){
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left')); //pega posição horizontal do "hero"
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top')); //pega posição vertical do "hero"

    let newLaser = document.createElement('img'); //cria o elemento como imagem
    newLaser.src = 'img/shoot.png'; //add imagem
    newLaser.classList.add('laser'); //add class 
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;

    return newLaser;
}
//função do movimento do laser
function moveLaser(laser){
    let laserInterval = setInterval(() => { //função para "setar" um tempo intervalo entre os disparos
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //comparando se cada alien foi atingido, se sim, troca o src da imagem
            if(checkLaserColision(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien')
                alien.classList.add('dead-alien');
                placar++;//aumentar placar 
            }
        })

        if(xPosition === 340){
            laser.remove(); //remove o disparo no limite da div
        } else{
            laser.style.left = `${xPosition + 8}px`; //velocidade do disparo na div
        }
    },10)
}

//add os inimigos
function createAliens(){
    let newAlien = document.createElement('img'); //cria elemento "newAlien" como img
    let alienSprite = alienImg[Math.floor(Math.random() * alienImg.length)] //puxa a array onde estão os inimigos

    newAlien.src = alienSprite; //add o inimigo ao elemento newAlien de acordo com a função de sorteio
    newAlien.classList.add('alien'); //add class dos inimigos
    newAlien.classList.add('alien-transition'); //add class de transição dos aliens
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`; //torna o aparecimento do elemento aletório no limite da div

    playArea.appendChild(newAlien); //add o elemento "newAlien" a div "main-play-area"
    moveAlien(newAlien);
}

//função para movimentar os inimigos
function moveAlien(alien){
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50){
            if(Array.from(alien.classList).includes('dead-alien')){
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30); 
}

//função de colisão
function checkLaserColision(laser, alien){
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;

    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if(laserLeft != 340 && laserLeft + 40 >= alienLeft){
        if(laserTop <= alienTop && laserTop >= alienBottom){
            return true;
        } else{
            return false;
        }
    } else{
        return false;
    }
}

//função start
startButton.addEventListener('click', (event) => {
    playGame();
})
function playGame(){
    placar = 0;
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    },2000);
}

//função game over
function gameOver(){
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let laser = document.querySelectorAll('.laser');
    laser.forEach((laser) => laser.remove());

    setTimeout(() => {
        alert(`GAME OVER!\nSeu placar foi de: ${placar}`);
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}

