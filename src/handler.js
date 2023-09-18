class Handler{
    constructor(pi,cd,canvas,endGame,delayTime,dw,dh){
        this.pi = pi;
        this.cd = cd;
        this.canvas = canvas;
        this.endGame = endGame;
        this.delayTime = delayTime;
        this.choicePicture = null;
        this.previousX = null;
        this.previousY = null;
        this.errorCount = 0;
        this.rightNum = 0;
        this.isMouseDown = false;
        this.dw = dw;
        this.dh = dh;        
        this.effectMusic = document.getElementById("effectMusic");
    }
    addCanvasEventListener(){
        this.canvas.addEventListener("mousedown",this.mouseDownHandler);
        this.canvas.addEventListener("mouseup",this.mouseUpHandler);
        this.canvas.addEventListener("mousemove",this.mouseMoveHandler);
    }
    removeCanvasEventListener(){
        this.canvas.removeEventListener("mousedown",this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup",this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove",this.mouseMoveHandler);
    }
    mouseDownHandler = (event) =>{
        this.isMouseDown = true;
        let mouseX = event.x - this.canvas.offsetLeft;
        let mouseY = event.y - this.canvas.offsetTop;
        for(let i = 0; i<25; i++){
            if(mouseX > this.pi.puzzles[i].dx && mouseX < this.pi.puzzles[i].dx + this.dw && mouseY > this.pi.puzzles[i].dy && mouseY < this.pi.puzzles[i].dy + this.dh){
                if(this.pi.puzzles[i].position != null){
                    this.choicePicture = this.pi.puzzles[i];
                    this.previousX = event.x;
                    this.previousY = event.y;
                }
            }
        }
    }
    
    mouseUpHandler = async (event) =>{
        this.isMouseDown = false;            
        let mouseX = event.x - this.canvas.offsetLeft;
        let mouseY = event.y - this.canvas.offsetTop;
        if(this.choicePicture){
            let pictureIndex = this.pi.puzzles.indexOf(this.choicePicture);
            // 맞는 위치에 놓았을 때
            if(mouseX > this.pi.pictureCorrectPosition[pictureIndex][0] && mouseX < this.pi.pictureCorrectPosition[pictureIndex][0] + this.dw && mouseY > this.pi.pictureCorrectPosition[pictureIndex][1] && mouseY < this.pi.pictureCorrectPosition[pictureIndex][1] + this.dh){
                this.rightNum += 1;
                this.effectMusic.src = "../audio/MP_스테이지 클리어 (레트로).mp3";
                this.effectMusic.play();
                this.choicePicture.dx =  this.pi.pictureCorrectPosition[pictureIndex][0];
                this.choicePicture.dy = this.pi.pictureCorrectPosition[pictureIndex][1];
                this.choicePicture.position = null;
                this.cd.draw();
                if(this.rightNum == 24){
                    // 게임 종료                    
                    this.endGame(true);
                }
            }
            // 틀린 위치에 두었을 때
            else{
                this.effectMusic.src = "../audio/MP_간결한 메시지 도착.mp3";
                this.effectMusic.play();
                this.choicePicture.dx = this.pi.pictureStartPosition[this.choicePicture.position][0];
                this.choicePicture.dy = this.pi.pictureStartPosition[this.choicePicture.position][1];      
                this.errorCount +=1;
                this.removeCanvasEventListener();                                      
                for( let i = 3; i>0;i--){
                    this.cd.draw();
                    this.cd.drawText(i,"300px Arial",280,450);                        
                    await this.delayTime(1000);
                }
                this.addCanvasEventListener();
                this.cd.draw();
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
                this.cd.draw();
            }
    }
}
export default Handler;