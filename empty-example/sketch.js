let songLen=0;//歌曲长度
let lyricPos=0;
let lyrics=[["浮","夸","风"],
            [0,12,14]];//歌词存储列表，先单字再时间
let mouseIsReleased=false;//p5没有很完善的鼠标注释功能
let mouseDelay=0;
let T;//当前时间码
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
    player=loadSound("data/1.mp3");
}

//p5 drawing parts
function setup() {
    createCanvas(1080,720);
    myLyric=new lyricLine(); //歌词线
    myPop=new popUp();       //打击按键
    myBoard=new countBoard(); //计分版
    myTable=theTable.getArray();//多余操作
    rectMode(CENTER);
    noStroke();
    player.loop();
}

function draw() {
    mov=T*100;
    myBackground();
    T=player.currentTime();//播放器时间
    myLyric.up();//更新
    myPop.up();//更新
    myBoard.up();//更新
    text(T,540,540);
    //resume(resumeMode);//暂停 这里有问题
}

function myBackground(){
    fill(0,0,0);
    rect(540,0,1080,360);
    fill(120,120,120);
    rect(540,360,1080,360);
    //背景叠图
}

function resume(a){
    fill(255,255,255);
    ellipse(1040,30,30,30);
    if(abs(mouseX-1040)<30 && abs(mouseY-30)<30 && mouseIsReleased===true && a===false){
        player.pause();
        resumeMode=true;
        mouseIsReleased=false;
        fill(0,150);
        rect(540,360,1080,720);

    }else if(player.isPlaying===false && mouseIsReleased===true) {
        player.play();
        resumeMode = false;
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
    }//随机将一到四位置的字符按照歌词位置增加
    this.up=function(){
        let nowP=0;
        for(let i=0;i<lyrics[0].length-1;i++) {
            if (T > lyrics[1][i] && T < lyrics[1][i + 1]) {
                nowP = i;
                lyricPos=nowP;
                break;
            }
        }//找到时间对应的歌词，获取当前歌词位置
        mouseDelay-=1;//动画延迟
        for(let i=0;i<4;i++){
            fill(150,150,150);
            rect(300+i*160,380,160,160,10,10,10,10);
            if(abs(mouseX-300-i*160)<80 && abs(mouseY-380)<80 && mouseIsReleased===true){
                if(mouseDelay>0){
                    for(let j=0;j<myLyric.tmp.length;j++){//查找时间线上有没有歌词
                        if(abs(myLyric.tmp[j].pos/100-T)<10 && myLyric.tmp[j].key===this.tmp[i]){
                            myLyric.tmp[j].trig=true;
                            if(abs(myLyric.tmp[j].pos/100-T)<8){
                                myBoard.scores.add(100);//评分
                            }else{
                                myBoard.scores.add(80);//评分
                            }
                            break;
                        }
                    }
                    fill(255,255,255);
                    rect(300+i*160,420,160,80,0,0,10,10);
                }
                this.tmpSize[i]=160;//放大效果
            }
            if(this.tmpTime[i]/100<520){//如果方格内存在过期，更新为四个后的
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
            text(search(this.tmp[i]),300+i*160-20,460);//只存储单字，不存储部首（写的时候忘了列表）
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
        }//自动删除
        while(this.tmp.length<=10){
            let a=new s_lyric(lyrics[0][lyricPos],lyrics[1][lyricPos]);//lyricPos在105行更新
            this.tmp.push(a);
        }//十个往后的歌词
    }
}

function s_lyric(){
    this.trig=false;
    this.px=0;
    this.key="";
    this.siz=80;
    this.pos=0;
    this.life=true;
    this.fade=false;//拓展（没用
    this.alpha=255;//拓展（没用
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
            }//靠近中心放大
        }else if(this.siz>80 && this.po===false){
            this.siz=this.siz*0.9;
        }
        if((this.pos-mov)<510){
            this.fade=true;
            if((this.pos-mov)<100){
                this.life=false;
            }
            this.alpha-=5;
        }//已过期的淡出
        fill(126,126,126,this.alpha);
        rect(this.pos-mov,200,this.siz,this.siz,5,5,5,5);
        textSize(this.siz);
        text(this.key,this.pos-mov,270);
        //就是画元件
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




