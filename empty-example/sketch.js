let songLen=0;
let lyricLen=0;
let lyricPos=0;
let lyrics=[["浮"],
    [0]];//歌词存储列表，先单字再时间
let mouseIsReleased=false;
let mouseDelay=0;
let T;//音频当前播放位置
let player;//音频
let myLyric;
let myPop;
let myBoard;//计分板
var csvStore="";//存储csv文件内容
var charac=[];//字
var radic=[];//部首
var lrc = "";//存储lrc文件内容


//preload must be at the top of the program
function preload(){
    player=loadSound("data/bgm.mp3");
    getLRC();
    getCSV();
}

//p5 drawing parts
function setup() {
    createCanvas(1080,720);
    myLyric=new lyricLine();//歌词线
    myPop=new popUp();		//打击按键
    myBoard=new countBoard();//计分版
    lyricLen=songLen*100;
    rectMode(CENTER);
    noStroke();
    spiltCharacter(csvStore);
    createLrcObj(lrc);

    player.play();
}

function draw() {
    mov=T*100;
    myBackground();
    T=player.currentTime();//播放器时间
    myLyric.up();//更新
    myPop.up();//更新
    myBoard.up();//更新
    text(T,540,720);
    //resume(resumeMode);//暂停 这里有问题
    //console.log(lyrics);
}

function myBackground(){ //背景
    fill(0,0,0);
    rect(540,216,1080,432);
    fill(120,120,120);
    rect(540,432+144,1080,288);
    fill(120,120,120);
    rect(540,144,1080,4);
    fill(120,120,120);
    rect(540,288,1080,4);
}

function mouseReleased(){
    mouseIsReleased=true;
    mouseDelay=10;
}

function search(a){
    for(let i=0;i<charac.length;i++){
        if(a===charac[i]){
            let b=radic[i];
            return b;
        }else{
            return "na";
        }
    }
}

function popUp(){
    this.tmp=["","","",""];
    this.tmpTime=[0,0,0,0];
    this.tmpSize=[120,120,120,120];
    this.tmpColor=[];
    for(let i=0;i<4;i++){
        let r=int(random(4));
        while(lyrics[0][i]===this.tmp[r]){
            r=int(random(4));
        }
        //随机将一到四位置的字符按照歌词位置增加
        this.tmp[i]=lyrics[0][i];
        this.tmpTime[i]=lyrics[1][i];
        this.tmpColor[i]=0;
    }
    //找到时间对应的歌词，获取当前歌词位置
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
            rect(300+i*160,512,160,160,10,10,10,10);
            if(abs(mouseX-300-i*160)<80 && abs(mouseY-512)<80){
                if(mouseDelay>0){
                    for(let j=0;j<myLyric.tmp.length;j++){//查找时间线上有没有歌词
                        if(abs(myLyric.tmp[j].pos/100-T)<10&& myLyric.tmp[j].key===this.tmp[i]){
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
                    rect(300+i*160,512,160,160,10,10,10,10);
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
            rect(300+i*160,512,this.tmpSize[i],this.tmpSize[i],10,10,10,10);
            fill(255,255,255);
            text(search(this.tmp[i]),300+i*160-50,540);//只存储单字，不存储部首（写的时候忘了列表）
        }

    }

}

let mov=0;
function lyricLine() {
    this.tmp = [];
    this.up = function () {
        if(this.tmp.length>0){//自动删除
            for (let i = 0; i < this.tmp.length; i++) {
                this.tmp[i].up();
                if (this.tmp[i].life === false) {
                    this.tmp.slice(i);
                }
            }
        }
        while(this.tmp.length<=10){//十个往后的歌词
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
    this.fade=false;//拓展（没用
    this.alpha=255;//拓展（没用
    this.po=false;
    this.born=function(pos,key){
        this.pos=pos*100;
        this.key=key;
    }
    this.up=function(){//靠近中心放大
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
        if((this.pos-mov)<540){//已过期的淡出
            this.fade=true;
            if((this.pos-mov)<100){
                this.life=false;
            }
            this.alpha-=5;
        }
        //画元件
        fill(126,126,126,this.alpha);
        rect(this.pos-mov,216,this.siz,this.siz,5,5,5,5);
        textSize(this.siz);
        text(this.key,this.pos-mov,216);

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
        vertex(250,0);
        vertex(200,70);
        vertex(0,70);
        vertex(0,0);
        endShape();
    }
    this.add=function(score){
        let a=new s_score(score);
        this.scores.push(a);
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


function getCSV() {//ajax拉取csv文件
    var ajax=new XMLHttpRequest();
    ajax.open("GET","data/xinhua.csv");
    ajax.onreadystatechange=function(){
        if(ajax.readyState== 4&&ajax.status==200){
            csvStore=ajax.responseText;
            //console.log(csvStore);//test
        }
    };
    ajax.send(null);
}

function spiltCharacter(csvStore){//解析csv内容
    if(csvStore.length==0) return;//没什么用的边界处理
    var characters=csvStore.split('\n');//用回车拆分成数组
    for(var i in characters){//遍历
        var s=characters[i].split(',');//数组每项再用逗号分开
        charac[i]=s[0];//前面汉字存到character
        radic[i]=s[1];//后面部首存到radical
    }
    /*
    for(var i in charac){	//test
        console.log(charac[i],"aaaa",radic[i]);
    }
    */
}


function getLRC() {//ajax拉取lrc文件
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "data/179.lrc");
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            lrc = ajax.responseText;
            //console.log(lrc);	//test
        }
    };
    ajax.send(null);
}

function createLrcObj(lrc) {
    var oLRC = {
        offset: 0, //时间补偿值，调整歌词整体位置
        ms: [] ,//歌词数组{t:时间,c:歌词}
    };
    if(lrc.length==0) return;
    var lrcs = lrc.split('\n');//用回车拆分成数组
    for(var i in lrcs) {//遍历歌词数组
        lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
        var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
        var s = t.split(":");//分离:前后文字
        if(isNaN(parseInt(s[0]))) { //不是数值
            for (var i in oLRC) {
                if (i != "ms" && i == s[0].toLowerCase()) {
                    oLRC[i] = s[1];
                }
            }
        }
        else { //是数值
            var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
            var start = 0;
            for(var k in arr){
                start += arr[k].length; //计算歌词位置
            }
            var content = lrcs[i].substring(start);//获取歌词内容
            for (var k in arr){
                var t = arr[k].substring(1, arr[k].length-1);//取[]间的内容
                var s = t.split(":");//分离:前后文字
                oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
                    t: (parseFloat(s[0])*60+parseFloat(s[1])).toFixed(3),
                    c: content
                });
            }
        }
    }
    /*oLRC.ms.sort(function (a, b) {//按时间顺序排序
        return a.t-b.t;
    });*/
    var lyric=[];//歌词里的字，某一行没有字则为空格
    var time=[];//字对应时间

    for(i=0;i<oLRC.ms.length;i++){
        var q=oLRC.ms[i].c.replace(/([^u4e00-u9fa5])(\s)(?=[^u4e00-u9fa5])/g, '$1');
        if(q.length==0){
            var q= q.replace(/(^\s*)|(\s*$)/g," ");
        }
        var s=q.split("");
        if(i<oLRC.ms.length-1){
            var totTime=parseFloat(oLRC.ms[i+1].t)-parseFloat(oLRC.ms[i].t);
            var array=new Array();
            for(j=0;j<s.length;j++){
                array[j]=(parseFloat(oLRC.ms[i].t)+j*totTime/s.length).toFixed(3);
            }
            time[i]=array;
        }
        else{
            var array=new Array();
            array[0]=(parseFloat(oLRC.ms[oLRC.ms.length-1].t)).toFixed(3);//时间保留3位小数
            time[oLRC.ms.length-1]=array;
        }
        lyric.push(s);
    }
    for(i=0;i<lyric.length;i++){
        for(j=0;j<lyric[i].length;j++){
            if(i==0 &&j==0){
                lyrics[0][0]=lyric[i][j];
                lyrics[1][0]=time[i][j];
            }
            else{
                lyrics[0].push(lyric[i][j]);
                lyrics[1].push(time[i][j]);
            }
        }
    }
    //console.log(lyrics);//看lyrics输出
}

