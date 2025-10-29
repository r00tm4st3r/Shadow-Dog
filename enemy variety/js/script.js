const canvas = document.getElementById('canvas1'); 
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 800;

class game {
    constructor() {
        this.enemies = [];
    }
    update(){
     
    }  
    draw(){

    }
    #addNewEnemy(){

    }
}      

class Enemy {
    constructor(){

    }
    update(){

    }
    draw(){

    }
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}