let songLen=0;
let lyricLen=0;
let lyricPos=0;
let lyrics=[["浮","夸","风"],
            [0,12,14]];
let mouseIsReleased=false;
let mouseDelay=0;
let T;
let theTable;
let player;
let myTable;
let myLyric;
let myPop;
let myBoard;
let resumeMode=false;


//preload must be at the top of the program
function preload(){
    theTable=loadTable('data/xinhua.csv','csv');
    print(1);
    print(theTable);
    player=loadSound("data/1.mp3");
}

//p5 drawing parts
function setup() {
    createCanvas(1080,720);
    print(2);
    myLyric=new lyricLine();
    myPop=new popUp();
    myBoard=new countBoard();
    lyricLen=songLen*100;
    myTable=theTable.getArray();
    rectMode(CENTER);
    noStroke();
    player.loop();

}

function draw() {
    mov=T*100;
    myBackground();
    T=player.currentTime;
    myLyric.up();
    myPop.up();
    myBoard.up();
    //print(frameCount / a);
    text(T,1080,0);
    resume(resumeMode);
}

function myBackground(){
    fill(0,0,0);
    rect(540,0,1080,360);
    fill(120,120,120);
    rect(540,360,1080,360);
}

function resume(a){
    if(abs(mouseX-1040)<30 && abs(mouseY-30)<30 && mouseIsReleased===true && a===false){
        player.pause();
        resumeMode=true;
        mouseIsReleased=false;
        fill(0,150);
        rect(540,360,1080,720);
        if(keyIsPressed) {
            resumeMode = false;
        }
    }else if(player.isPlaying===false) {
        player.play();
    }
}

function mouseReleased(){
    mouseIsReleased=true;
    mouseDelay=10;
}

function search(a){
    for(let i=0;i<myTable.length;i++){
        if(a===myTable[0][i]){
            let b=myTable[1][i];
            return b;
        }else{
            return "na";
        }
    }
}

function popUp(){
    this.tmp=[];
    this.tmpTime=[];
    this.tmpSize=[120,120,120,120];
    this.tmpColor=[];
    for(let i=0;i<4;i++){
        let r=int(random(4));
        while(lyrics[0][i]===this.tmp[r]){
            r=int(random(4));
        }
        this.tmp[i]=lyrics[0][i];
        this.tmpTime[i]=lyrics[1][i];
        this.tmpColor[i]=0;
    }
    this.up=function(){
        let nowP=0;
        print("lyrics");
        for(let i=0;i<lyrics[0].length-1;i++) {
            if (T > lyrics[1][i] && T < lyrics[1][i + 1]) {
                nowP = i;
                break;
            }
        }
        mouseDelay-=1;
        for(let i=0;i<4;i++){
            fill(150,150,150);
            rect(300+i*160,380,160,160,10,10,10,10);
            if(abs(mouseX-300-i*160)<80 && abs(mouseY-380)<80){
                if(mouseDelay>0){
                    for(let j=0;j<myLyric.tmp.length;j++){
                        if(abs(myLyric.tmp[j].pos/100-T)<10){
                            myLyric.tmp[j].trig=true;
                            if(abs(myLyric.tmp[j].pos/100-T)<8){
                                myBoard.scores.add(100);
                            }else{
                                myBoard.scores.add(80);
                            }
                            break;
                        }
                    }
                    fill(255,255,255);
                    rect(300+i*160,420,160,80,0,0,10,10);
                }
                this.tmpSize[i]=160;
            }
            if(this.tmpTime[i]/100<520){
                this.tmp[i]=lyrics[0][nowP+4];
                this.tmpTime[i]=lyrics[1][nowP+4];
            }
        }
        for(let i=0;i<4;i++){
            if(this.tmpSize[i]>120){
                this.tmpSize[i]=this.tmpSize[i]*0.93;
            }
            fill(0,0,0);
            rect(300+i*160,380,this.tmpSize[i],this.tmpSize[i],10,10,10,10);
            fill(255,255,255);
            text(search(this.tmp[i]),300+i*160-20,460);
        }
    }
}


let mov=0;
function lyricLine() {
    this.tmp = [];
    this.up = function () {
        if(this.tmp.length>0){
            for (let i = 0; i < this.tmp.length; i++) {
                this.tmp[i].up();
                if (this.tmp[i].life === false) {
                    this.tmp.slice(i);
                }
            }
        }
        while(this.tmp.length<=10){
            let a=new s_lyric(lyrics[0][lyricPos],lyrics[1][lyricPos]);
            this.tmp.push(a);
        }

    }
}

function s_lyric(){
    this.trig=false;
    this.px=0;
    this.key="";
    this.siz=80;
    this.pos=0;
    this.life=true;
    this.fade=false;
    this.alpha=255;
    this.po=false;
    this.born=function(pos,key){
        this.pos=pos*100;
        this.key=key;
    }
    this.up=function(){
        if((this.pos-mov)>540-30 && (this.pos-mov)<540+30){
            this.siz=120;
            if(this.trig===true || this.po===true){
                this.size-=50;
                if(this.siz<0){
                    this.life=false
                }
            }
        }else if(this.siz>80 && this.po===false){
            this.siz=this.siz*0.9;
        }
        if((this.pos-mov)<540){
            this.fade=true;
            if((this.pos-mov)<100){
                this.life=false;
            }
            this.alpha-=5;
        }
        fill(126,126,126,this.alpha);
        rect(this.pos-mov,200,this.siz,this.siz,5,5,5,5);
        textSize(this.siz);
        text(this.key,this.pos-mov,270);

    }
}


function countBoard(){
    this.scores=[];
    this.num=0;
    this.up=function(){
        for(let i=0;i<this.scores.length;i++){
            if(this.scores[i].life===false){
                this.scores.slice(i);
            }
            this.scores[i].up();
        }
        fill(255,255,255);
        beginShape();
        vertex(0,0);
        vertex(400,0);
        vertex(350,50);
        vertex(0,50);
        vertex(0,0);
        endShape();
    }
    this.add=function(score){
        let a=new s_score(score);
        this.scores.add(a);
    }
}
function s_score(score){
    this.size=120;
    this.num=score;
    this.life=true;
    this.up=function(){
        if(this.size<180){
            textSize(this.size);
            fill(255,255,0);
            rect(540,400-this.size/5,this.size*1.5,this.size,this.size/100,this.size/100,this.size/100,this.size/100);
            text(this.num,540,400-this.size/5);
            this.size*=1.1;
        }else{
            this.life=false;
        }
    }
}




