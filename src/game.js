// 전역 변수

// 캔버스 정보 가져오기
let canvas = document.getElementById("mycanvas");
let ctx = canvas.getContext('2d');
ctx.lineWidth = 5;

//이미지
let image = new Image();
// 이미지 저장 경로
let nomalImagePath = ["../image_nomal/잠만보.jpg","../image_nomal/피크닉.jpg"];
let hardImagePath = ["../image_hard/벛꽃.jpg","../image_hard/비.jpg"];
let veryhardImagePath = ["../image_veryhard/바다.jpg","../image_veryhard/우주.jpg"];

// imageControl객체 및 canvas에 그려질 넓이 변수
let ic;
let dw = 100;
let dh = 100;

// 선택한 그림
let choicePicture;
let isMouseDown = false;
// 이전 x,y 좌표
let previousX = null;
let previousY = null;
let rightNum = 0;

// 음악 element
const backgroudMusic = document.getElementById("backgroundMusic");
const effectMusic = document.getElementById("effectMusic");
// 힌트 버튼 element
const btnHint = document.getElementById("hint");
// 게임 플레이 시간 interval객체
let playtime;

// 이벤트 리스너

document.getElementById("btnstart").addEventListener('click',startGame);
btnHint.addEventListener('click',function(){
    showAnswer(3);
});
function addCanvasEventListener(){
    canvas.addEventListener("mousedown",mouseDownHandler);
    canvas.addEventListener("mouseup",mouseUpHandler);
    canvas.addEventListener("mousemove",mouseMoveHandler);
}
function removeCanvasEventListener(){
    canvas.removeEventListener("mousedown",mouseDownHandler);
    canvas.removeEventListener("mouseup",mouseUpHandler);
    canvas.removeEventListener("mousemove",mouseMoveHandler);
}

// 이벤트 핸들러

function mouseDownHandler(event){
    isMouseDown = true;
    let mouseX = event.x - canvas.offsetLeft;
    let mouseY = event.y - canvas.offsetTop;
    for(let i = 0; i<25; i++){
        if(mouseX > ic.puzzles[i].dx && mouseX < ic.puzzles[i].dx + dw && mouseY > ic.puzzles[i].dy && mouseY < ic.puzzles[i].dy + dh){
            if(ic.puzzles[i].position != null){
                choicePicture = ic.puzzles[i];
            }
        }
    }
}

async function mouseUpHandler(event){
    isMouseDown = false;            
    let mouseX = event.x - canvas.offsetLeft;
    let mouseY = event.y - canvas.offsetTop;
    if(choicePicture){
        let pictureIndex = ic.puzzles.indexOf(choicePicture);
        // 맞는 위치에 놓았을 때
        if(mouseX > ic.pictureCorrectPosition[pictureIndex][0] && mouseX < ic.pictureCorrectPosition[pictureIndex][0] + dw && mouseY > ic.pictureCorrectPosition[pictureIndex][1] && mouseY < ic.pictureCorrectPosition[pictureIndex][1] + dh){
            rightNum += 1;
            effectMusic.src = "../audio/MP_스테이지 클리어 (레트로).mp3";
            effectMusic.play();
            choicePicture.dx =  ic.pictureCorrectPosition[pictureIndex][0];
            choicePicture.dy = ic.pictureCorrectPosition[pictureIndex][1];
            choicePicture.position = null;
            draw();
            if(rightNum == 24){
                // 게임 종료
                endGame(true);
            }
        }
        // 틀린 위치에 두었을 때
        else{
            effectMusic.src = "../audio/MP_간결한 메시지 도착.mp3";
            effectMusic.play();
            choicePicture.dx = ic.pictureStartPosition[choicePicture.position][0];
            choicePicture.dy = ic.pictureStartPosition[choicePicture.position][1];                                            
            for( let i = 3; i>0;i--){
                draw();
                drawText(i,"300px Arial");                        
                await delayTime(1000);
            }
            draw();
        }
    }
        choicePicture = null;
        previousX,previousY = null;
}

function mouseMoveHandler(event){
    let moveX = 0;
    let moveY = 0;
    if(isMouseDown && choicePicture){
        if(previousX !== null && previousY !== null){
            moveX = event.x - previousX;
            moveY = event.y - previousY;
            previousX = event.x;
            previousY = event.y;
        }else{
            previousX = event.x;
            previousY = event.y;
        }
        choicePicture.dx += moveX;
        choicePicture.dy += moveY;
        draw();
    }
}
// 볼륨 설정
function changeVolume(){
    const volumeControl = document.getElementById('volumeControl');
    backgroudMusic.volume = volumeControl.value;
    effectMusic.volume = volumeControl.value;
}

// 게임 관련 함수

// 게임 시작
function startGame(){
    getImage(document.getElementById("difficulty").value);
    btnHint.disabled = false;
    image.onload = function(){
    // 초기 설정
    ic =  new ImageControl(image);
    rightNum = 0;
    clearInterval(playtime);
    addCanvasEventListener();
    backgroudMusic.play();
    showAnswer(3);
    playTime();
    }
}

// 게임 종료
function endGame(state){
    removeCanvasEventListener();
    backgroudMusic.pause();
    clearInterval(playtime);            
    if(state){  
        drawText("Complete","100px Arial");
    }else{
        drawText("GAME OVER","100px Arial");
    }
}

// 랜덤으로 image 뽑기
function getImage(difficulty){            
    let imageIndex = Math.floor(Math.random() * 2);
    switch(difficulty){
        case "nomal":
            image.src = nomalImagePath[imageIndex];  
            break;
        case "hard":
            image.src = hardImagePath[imageIndex];
            break;
        case "veryhard":
            image.src = veryhardImagePath[imageIndex];
            break;
    }
}

// 딜레이 함수
function delayTime(time){
    removeCanvasEventListener();
    btnHint.disabled = true;
    return new Promise((resolve) => {
        setTimeout(function(){
            addCanvasEventListener();
            btnHint.disabled = false;
            resolve();
        }, time);
    });
}

// 게임 플레이 시간
function playTime(){
    let endtime = 300;
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
        drawText(i,"300px Arial");    
        await delayTime(1000);
    }
    draw()
}

// canvas 그리는 함수

// 화면 그리기
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
        for(let i =0; i<25;i++){
            ctx.drawImage(image,ic.puzzles[i].sx,ic.puzzles[i].sy,ic.sw,ic.sh,ic.puzzles[i].dx,ic.puzzles[i].dy,dw,dh);
        }
        drawGrid();
}

// 퍼즐 격판 그리기
function drawGrid(){        
for(let i = 1; i<7; i++){
    ctx.moveTo(dw,dh*i);
    ctx.lineTo(dw*6,dh*i);
    ctx.moveTo(dw*i,dh);
    ctx.lineTo(dw*i,dh*6);
}
ctx.stroke();
}

// 글 입력 하기
function drawText(text, font){
ctx.font = font;
ctx.fillStyle = "gray";
ctx.fillText(text,280,450);
}