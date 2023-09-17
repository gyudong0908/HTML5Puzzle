class Handler{
    constructor(pi,cd,endGame){
        this.pi = pi;
        this.cd = cd;
        this.endGame = endGame;
        this.choicePicture = null;
        this.previousX = null;
        this.previousY = null;
        this.errorCount = 0;
        this.rightNum = 0;
        this.isMouseDown = false;
    }
    addCanvasEventListener(){
        canvas.addEventListener("mousedown",this.mouseDownHandler);
        canvas.addEventListener("mouseup",this.mouseUpHandler);
        canvas.addEventListener("mousemove",this.mouseMoveHandler);
    }
    removeCanvasEventListener(){
        canvas.removeEventListener("mousedown",this.mouseDownHandler);
        canvas.removeEventListener("mouseup",this.mouseUpHandler);
        canvas.removeEventListener("mousemove",this.mouseMoveHandler);
    }
    mouseDownHandler = (event) =>{
        this.isMouseDown = true;
        let mouseX = event.x - canvas.offsetLeft;
        let mouseY = event.y - canvas.offsetTop;
        for(let i = 0; i<25; i++){
            if(mouseX > pi.puzzles[i].dx && mouseX < pi.puzzles[i].dx + dw && mouseY > pi.puzzles[i].dy && mouseY < pi.puzzles[i].dy + dh){
                if(pi.puzzles[i].position != null){
                    this.choicePicture = pi.puzzles[i];
                    this.previousX = event.x;
                    this.previousY = event.y;
                }
            }
        }
    }
    
    mouseUpHandler = async (event) =>{
        this.isMouseDown = false;            
        let mouseX = event.x - canvas.offsetLeft;
        let mouseY = event.y - canvas.offsetTop;
        if(this.choicePicture){
            let pictureIndex = pi.puzzles.indexOf(this.choicePicture);
            // 맞는 위치에 놓았을 때
            if(mouseX > pi.pictureCorrectPosition[pictureIndex][0] && mouseX < pi.pictureCorrectPosition[pictureIndex][0] + dw && mouseY > pi.pictureCorrectPosition[pictureIndex][1] && mouseY < pi.pictureCorrectPosition[pictureIndex][1] + dh){
                this.rightNum += 1;
                effectMusic.src = "../audio/MP_스테이지 클리어 (레트로).mp3";
                effectMusic.play();
                this.choicePicture.dx =  pi.pictureCorrectPosition[pictureIndex][0];
                this.choicePicture.dy = pi.pictureCorrectPosition[pictureIndex][1];
                this.choicePicture.position = null;
                cd.draw();
                if(this.rightNum == 24){
                    // 게임 종료                    
                    this.endGame(true);
                }
            }
            // 틀린 위치에 두었을 때
            else{
                effectMusic.src = "../audio/MP_간결한 메시지 도착.mp3";
                effectMusic.play();
                this.choicePicture.dx = pi.pictureStartPosition[this.choicePicture.position][0];
                this.choicePicture.dy = pi.pictureStartPosition[this.choicePicture.position][1];      
                this.errorCount +=1;
                this.removeCanvasEventListener();                                      
                for( let i = 3; i>0;i--){
                    cd.draw();
                    cd.drawText(i,"300px Arial",280,450);                        
                    await delayTime(1000);
                }
                this.addCanvasEventListener();
                cd.draw();
            }
        }
        this.choicePicture = null;
        this.previousX,this.previousY = null;
    }
    
    mouseMoveHandler = (event) =>{
        let moveX = 0;
        let moveY = 0;
            if(this.isMouseDown && this.choicePicture){
                if(this.previousX !== null && this.previousY !== null){
                    moveX = event.x - this.previousX;
                    moveY = event.y - this.previousY;
                    this.previousX = event.x;
                    this.previousY = event.y;
                }
                this.choicePicture.dx += moveX;
                this.choicePicture.dy += moveY;
                cd.draw();
            }
    }
}