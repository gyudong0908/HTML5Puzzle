// 전역 변수

// 캔버스 정보 가져오기
let canvas = document.getElementById("mycanvas");
let ctx = canvas.getContext('2d');
ctx.lineWidth = 5;

// 이미지 저장 경로
let nomalImagePath = ["../image_nomal/잠만보.jpg","../image_nomal/피크닉.jpg","../image_nomal/곰.jpg","../image_nomal/니모.jpg","../image_nomal/여우.jpg"];
let hardImagePath = ["../image_hard/벛꽃.jpg","../image_hard/비.jpg","../image_hard/피사의사탑.jpg","../image_hard/구름.jpg","../image_hard/경치.jpg"];
let veryhardImagePath = ["../image_veryhard/바다.jpg","../image_veryhard/우주.jpg","../image_veryhard/야자수.jpg","../image_veryhard/달.jpg","../image_veryhard/등.jpg"];

// canvas에 그려질 넓이 변수
let dw = 100;
let dh = 100;

// 음악 element
const backgroudMusic = document.getElementById("backgroundMusic");
const effectMusic = document.getElementById("effectMusic");
// 힌트 버튼 element
const btnHint = document.getElementById("hint");

// 게임 플레이 시간 interval객체
let playtime;
// 남은 게임 시간
let endTime;
// 이전 퍼즐 이미지
let previousImage = null;

// Handler 객체
let handler;
// imageInit 객체
let im;
// canvasDraw객체
let cd;
// 이미지 객체
let image = new Image();



// 이벤트 리스너

document.getElementById("btnstart").addEventListener('click',startGame);
document.onload = showRank();
document.getElementById('difficulty').addEventListener('change',showRank);
btnHint.addEventListener('click',function(){
    showAnswer(3);
});
// 볼륨 설정
function changeVolume(){
    const volumeControl = document.getElementById('volumeControl');
    const backgroudMusic = document.getElementById("backgroundMusic");
    const effectMusic = document.getElementById("effectMusic");
    backgroudMusic.volume = volumeControl.value;
    effectMusic.volume = volumeControl.value;
}

// 게임 시작
function startGame(){
    getImage(document.getElementById("difficulty").value);
    btnHint.disabled = false;
    document.getElementById("btnstart").disabled = true;
    image.onload = function(){
    // 객체 가져오기
    im =  new ImageInit(image);
    cd = new CanvasDraw(image,ctx,im,dw,dh);
    handler = new Handler(im,cd,endGame);    
    showRank();
    clearInterval(playtime);
    handler.addCanvasEventListener();
    backgroudMusic.play();
    showAnswer(3).then(()=>{
        playTime();
        document.getElementById("btnstart").disabled = false;
    });
    }
}

// 게임 종료
function endGame(state){
    handler.removeCanvasEventListener();
    backgroudMusic.pause();
    clearInterval(playtime);
    if(state){  
        cd.drawText("Complete","100px Arial",150,350);
        // 게임 정보 저장
        if(sessionStorage.getItem(endtime + "_" + document.getElementById("difficulty").value) !==null && sessionStorage.getItem(endtime) < handler.errorCount){}
        else{
            sessionStorage.setItem(endtime + "_" + document.getElementById("difficulty").value,handler.errorCount);          
        }
    }else{
        cd.drawText("GAME OVER","100px Arial",50,350);
    }
    showRank();
}

// 랜덤으로 image 뽑기
function getImage(difficulty){  
    let imageIndex;          
    switch(difficulty){
        case "nomal":
            imageIndex = Math.floor(Math.random() * nomalImagePath.length);
            while(previousImage === nomalImagePath[imageIndex]){
                imageIndex = Math.floor(Math.random() * nomalImagePath.length);
            }
            previousImage = nomalImagePath[imageIndex];
            image.src = nomalImagePath[imageIndex];
            backgroudMusic.src = "../audio/WhiteChristmas.mp3";
            break;
        case "hard":
            imageIndex = Math.floor(Math.random() * hardImagePath.length);
            while(previousImage === hardImagePath[imageIndex]){
                imageIndex = Math.floor(Math.random() * hardImagePath.length);
            }
            previousImage = hardImagePath[imageIndex];
            image.src = hardImagePath[imageIndex];
            backgroudMusic.src = "../audio/eco-technology-145636.mp3";
            break;
        case "veryhard":
            imageIndex = Math.floor(Math.random() * veryhardImagePath.length);
            while(previousImage === veryhardImagePath[imageIndex]){
                imageIndex = Math.floor(Math.random() * veryhardImagePath.length);
            }
            previousImage = veryhardImagePath[imageIndex];
            image.src = veryhardImagePath[imageIndex];
            backgroudMusic.src = "../audio/veryhardBackground.mp3";
            break;
    }
}

// 딜레이 함수
function delayTime(time){
    handler.removeCanvasEventListener();
    btnHint.disabled = true;
    document.getElementById("btnstart").disabled = true;
    return new Promise((resolve) => {
        setTimeout(function(){
            handler.addCanvasEventListener();
            btnHint.disabled = false;
            document.getElementById("btnstart").disabled = false;
            resolve();
        }, time);
    });
}

// 게임 플레이 시간
function playTime(){
    endtime = 300;
    document.getElementById("time").textContent = "남은시간 : " + endtime;
    playtime = setInterval(function(){
        endtime -=1;
        document.getElementById("time").textContent = "남은시간 : " + endtime;
    },1000);
    setTimeout(function(){
        clearInterval(playtime);
        endGame(false);
    },300000)
}

// 정답 화면 3초 동안 보여주기
async function showAnswer(time){
    for(let i = time; i>0; i--){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(image, 0, 0, image.width, image.height, 0,0, canvas.width, canvas.height);
        cd.drawText(i,"300px Arial",280,450);    
        await delayTime(1000);
    }
    cd.draw()
}

// 순위 정보 출력
function showRank(){
    document.getElementById("rankTable").innerHTML = ""
    document.getElementById("rankTable").innerHTML = `                    
    <h2>Rank</h2>
    <tr>
        <th>순위</th>
        <th>남은시간</th>
        <th>틀린횟수</th>
    </tr>`
    let rankList = [];
    for(let i=0; i<sessionStorage.length;i++){
         let key = sessionStorage.key(i);         
         let value = sessionStorage.getItem(key);
         let keyarr = key.split("_");
         if(keyarr[1] == document.getElementById("difficulty").value){
            rankList.push([keyarr[0],value]);
         }
    }
    rankList.sort(function(a,b){
        return  b[0] - a[0];
    });
    for(let i = 0; i<10 && i<rankList.length; i++){
        document.getElementById("rankTable").innerHTML += `                    
            <tr>
                <th>${i+1}</th>
                <th>${rankList[i][0]}</th>
                <th>${rankList[i][1]}</th>
            </tr>`
    }    
}