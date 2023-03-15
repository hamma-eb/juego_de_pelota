

let game;
function Canvas() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = innerWidth;
    this.canvas.height = innerWidth;
    document.querySelector("#root").appendChild(this.canvas);
}
Canvas.prototype.position = function() {
    return this.canvas.getBoundingClientRect();
}
const canvas = new Canvas();
function porsentage(n = 10) {
    return (innerWidth/100)*n;
}

function Neshan() {
    this.d = false;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 100;
    this.y2 = 100;
    this.neshan = {
        p: false,
        x:0,
        y:0,
        r:2
    }

    window.addEventListener("touchstart",(e)=> {
        if(game.jugar) {
            this.d = true;
            this.set(e);
            game.pelota.t = false;
        }
    })
    window.addEventListener("touchmove",(e)=> {
        if(game.jugar&& this.d) {
        this.set(e);
        }
    })
    window.addEventListener("touchend",(e)=> {
        if(game.jugar && this.d) {
        this.d = false;
        this.tira(e);
        game.jugar = false;
        game.pelota.permiso = true;
        }
    })
}
Neshan.prototype.set = function(e) {
    let x = e.changedTouches[0].pageX - canvas.position().x;
    let y = e.changedTouches[0].pageY - canvas.position().y;
    this.x1 = porsentage(game.pelota.data.x);
    this.y1 = porsentage(game.pelota.data.y);
    this.x2 = x;
    this.y2 = y;

    this.neshan.x = this.x1 + ((this.x1 - this.x2)/200)*100;
    this.neshan.y = this.y1 + ((this.y1 - this.y2)/200)*100;
}
Neshan.prototype.tira = function(e) {
    let x1 = e.changedTouches[0].pageX - canvas.position().x;
    let y1 = e.changedTouches[0].pageY - canvas.position().y;
    let x2 = porsentage(game.pelota.data.x);
    let y2 = porsentage(game.pelota.data.y);
    
    game.pelota.data.sx = (x1 - x2)/200 < 0 ? Math.abs((x1 - x2)/200) : ((x1 - x2)/200)*-1;
    game.pelota.data.sy = (y1 - y2)/200 < 0 ? Math.abs((y1 - y2)/200) : ((y1 - y2)/200)*-1;
}
Neshan.prototype.draw = function() {
    if(this.d) {
        canvas.ctx.fillStyle = "#F55050";
        canvas.ctx.beginPath();
        canvas.ctx.arc(this.neshan.x, this.neshan.y, porsentage(this.neshan.r), 0, 2 * Math.PI);
        canvas.ctx.fill();
        canvas.ctx.lineWidth = 2;
        canvas.ctx.strokeStyle = "#F48484";
        canvas.ctx.moveTo(this.x1,this.y1);
        canvas.ctx.lineTo(this.x2,this.y2);
        canvas.ctx.stroke();
        canvas.ctx.fillStyle = "#F55050";
        canvas.ctx.beginPath();
        canvas.ctx.arc(this.x2, this.y2, porsentage(2), 0, 2 * Math.PI);
        canvas.ctx.fill();
    }
}
Neshan.prototype.update = function() {
    
}

function Pelota(x=0,y=0,r=10,n= 1,sx=0,sy=0) {
    this.data = {x,y,r,n,sx,sy};
    this.t = true;
    this.lineas = [];
    this.permiso = false;
}
Pelota.prototype.draw = function() {
    let {x,y,r,n} = this.data;
    canvas.ctx.strokeStyle = "#F16767";
    if(this.lineas.length > 0) {
        canvas.ctx.moveTo(porsentage(this.lineas[0].x),porsentage(this.lineas[0].y));
        this.lineas.forEach(e => {
            canvas.ctx.lineTo(porsentage(e.x),porsentage(e.y));
        })
        canvas.ctx.stroke();
    }
    canvas.ctx.fillStyle = "#F55050";
    canvas.ctx.strokeStyle = "#00000000";
    
    canvas.ctx.beginPath();
    canvas.ctx.arc(porsentage(x), porsentage(y), porsentage(r), 0, 2 * Math.PI);
    canvas.ctx.fill();
    canvas.ctx.stroke();
    canvas.ctx.fillStyle = "#ffffff";
    canvas.ctx.font = `${porsentage(r)/2}px Arial`;
    canvas.ctx.fillText("GMV", porsentage(x)-(porsentage(r)/1.6), porsentage(y)+(porsentage(r)/4));
    if(this.t) {
        canvas.ctx.strokeStyle = "#ffffff";
        canvas.ctx.font = porsentage(20)+"px Arial";
        canvas.ctx.strokeText(`${this.data.n}`, porsentage(45), porsentage(35));
    }
}
Pelota.prototype.update = function() {
    this.data.x += this.data.sx;
    this.data.y += this.data.sy;
    if(this.permiso)this.lineas.push({x:this.data.x,y:this.data.y});
    if(this.lineas.length > 0 && game.frame % 2 == 0 ) {
        let nl = [];
        this.lineas.forEach((e,index)=> {
            if(index > 0) {
                nl.push(e);
            }
        })
        this.lineas = nl;
    }
}
Pelota.prototype.falta = function(f = 0) {
    if(!this.t) {
        if(this.data.n > 0) {
            this.t = true;
            this.data.n -= f;
            setTimeout(()=> {
                this.t = false;
            },100)
            
        }else {

            game.fayar();
            this.t = true;
        }
    }
}



function Pared(x=0,y=0,w=100,h=100,l = "l",colors={},permiso) {
    this.data = {x,y,w,h,l,colors,permiso};
}
Pared.prototype.draw = function() {
    let {x,y,w,h,permiso,l} = this.data;
    if(permiso) {
        if(l !== "f") {
            canvas.ctx.fillStyle = this.data.colors.c1;
            canvas.ctx.fillRect(porsentage(x),porsentage(y),porsentage(w),porsentage(h));
            canvas.ctx.strokeStyle = this.data.colors.c2;
            canvas.ctx.lineWidth = 2;
        }
        switch (l) {
            case "l":
                canvas.ctx.moveTo(porsentage(x)+porsentage(w),porsentage(y));
                canvas.ctx.lineTo(porsentage(x)+porsentage(w),porsentage(y)+porsentage(h));
                canvas.ctx.stroke();
                break;
                case "r":
                    canvas.ctx.moveTo(porsentage(x),porsentage(y));
                    canvas.ctx.lineTo(porsentage(x),porsentage(y)+porsentage(h));
                    canvas.ctx.stroke();
                    break; 
                    case "t":
                        canvas.ctx.moveTo(porsentage(x),porsentage(y)+porsentage(h));
                        canvas.ctx.lineTo(porsentage(x)+porsentage(w),porsentage(y)+porsentage(h));
                        canvas.ctx.stroke();
                        break;
                        case "b":
                            canvas.ctx.moveTo(porsentage(x),porsentage(y));
                            canvas.ctx.lineTo(porsentage(x)+porsentage(w),porsentage(y));
                            canvas.ctx.stroke();
                            break;            
                    
        
           
        }
    }
}
Pared.prototype.update = function() {
    let px = game.pelota.data.x;
    let py = game.pelota.data.y;
    let pw = game.pelota.data.w;
    let ph = game.pelota.data.h;
    let pr = game.pelota.data.r;
    let {x,y,w,h} = this.data;

    
    if(px + pr >= x && px-pr <= x+w && py + pr >= y && py - pr <= y+h) {
      
        game.pelota.falta(1);
        switch (this.data.l) {
            case "l":
                game.pelota.data.sx = Math.abs(game.pelota.data.sx);
                break;
            case "r":
                game.pelota.data.sx = game.pelota.data.sx*-1;
                break;
            case "t":
                game.pelota.data.sy = Math.abs(game.pelota.data.sy);
                break;
            case "b":
                game.pelota.data.sy = game.pelota.data.sy*-1;
                break;    
            case "f":
                if(game.pelota.data.n <= 0) {

                    game.ganar();
                }else {
                    game.fayar();
                }
                break;    
        }
    }    
}


function Game(niveles,nivel) {
    this.frame = 0;
    this.jugar = false;
    this.numNivel = nivel;
    this.niveles = niveles;
    this.neshan = new Neshan();
    this.paredes = [];
    this.pelota = {};
    this.g = false;
    this.f = false;
    this.button = {
        x:35,
        y:60,
        w:30,
        h:8,
    }

    window.addEventListener("touchstart",(e)=> {
        let tx = e.targetTouches[0].pageX - canvas.position().x;
        let ty = e.targetTouches[0].pageY - canvas.position().y;
        let {x,y,w,h} = this.button;

        if(tx > porsentage(x) && tx < porsentage(x)+porsentage(w) && ty > porsentage(y) && ty < porsentage(y)+porsentage(h)) {
            if(this.g) {
                if(this.numNivel == this.niveles.length) {
                    this.g = false;
                    this.numNivel = 1;
                    game.crearNivel();
                    setTimeout(()=> {
                        this.jugar = true;
                    },1000)
                    return 1
                }
                if(this.numNivel < this.niveles.length) {
                    this.g = false;
                    this.numNivel += 1;
                    game.crearNivel();
                    setTimeout(()=> {
                    this.jugar = true;
                    },1000)
                }
            }
            if(this.f) {
                this.jugar = false;
                this.f = false;
                game.crearNivel();
                setTimeout(()=> {
                    this.jugar = true;
                },1000)
            }
        }
        
        
    })

}





Game.prototype.draw = function() {
    this.paredes.forEach(p => {
        p.draw();
    })
    this.neshan.draw();
    this.pelota.draw();
    canvas.ctx.strokeStyle = "#ffffff";
    if(this.g) {
        canvas.ctx.font = porsentage(10)+"px Arial";
        canvas.ctx.strokeText(`Has ganado!!!`, porsentage(20), porsentage(50));
        let {x,y,w,h} = this.button;
        canvas.ctx.fillStyle = "#F48484";
        canvas.ctx.fillRect(porsentage(x),porsentage(y),porsentage(w),porsentage(h));
        canvas.ctx.fillStyle = "#ffffff";
        canvas.ctx.font = porsentage(w/(h*1.3))+"px Arial";
        if(this.numNivel < this.niveles.length) {
            canvas.ctx.fillText("Sigiente nivel",porsentage(x+h/1.3),porsentage(y+(h/1.5)));
        }else {
            canvas.ctx.fillText("Volver a primer nivel",porsentage(x+h/4),porsentage(y+(h/1.5)));
        }
    }
    if(this.f) {
        canvas.ctx.font = porsentage(10)+"px Arial";
        canvas.ctx.strokeText(`Has fallado!!!`, porsentage(20), porsentage(50));
        let {x,y,w,h} = this.button;
        canvas.ctx.fillStyle = "#F48484";
        canvas.ctx.fillRect(porsentage(x),porsentage(y),porsentage(w),porsentage(h));
        canvas.ctx.fillStyle = "#ffffff";
        canvas.ctx.font = porsentage(w/(h*1.2))+"px Arial";
        canvas.ctx.fillText("Otra vez",porsentage(x+h),porsentage(y+(h/1.5)));
       
    }

}
Game.prototype.update = function() {
    if(!this.g && !this.f) {
        this.paredes.forEach(p => {
            p.update();
        })
        this.neshan.update();
        this.pelota.update();
    }
}


Game.prototype.ganar = function() {
    this.jugar = false;
    this.g = true;
}
Game.prototype.fayar = function() {
    this.jugar = false;
    this.f = true;
}
Game.prototype.crearNivel = function() {
    
    this.paredes = [];
    this.niveles[this.numNivel-1].paredes.forEach((p,index) => {
        let permiso;
        let colors = {c1:"#E8D2A6",c2:"#F16767"};
        if(index < this.niveles[this.numNivel-1].paredes.length - 2){
            permiso = true;
        }else {
            permiso = true;
        } 
        this.paredes.push(new Pared(p[0],p[1],p[2],p[3],p[4],colors,permiso));
    })
    this.pelota = new Pelota(
        this.niveles[this.numNivel-1].pelota[0],
        this.niveles[this.numNivel-1].pelota[1],
        this.niveles[this.numNivel-1].pelota[2],
        this.niveles[this.numNivel-1].pelota[3],
    )
 
}






function anim() {
    requestAnimationFrame(anim);
    canvas.ctx.clearRect(0,0,porsentage(100),porsentage(100));
    game.frame++;
    game.draw();
    game.update();
}

function play(niveles,numNivel) {

    game = new Game(niveles,numNivel);
    game.crearNivel();
    setTimeout(()=> {
        game.jugar = true;
    },200)

}


function descargarNiveles() {
    let http = new XMLHttpRequest();
    http.open("POST","/descargar_niveles",true);
    http.onreadystatechange = function() {
        if(http.status == 200 && http.readyState == 4) {
            play(JSON.parse(http.responseText),1)
            anim();
           
        }
    }
    http.send();
}
descargarNiveles();
