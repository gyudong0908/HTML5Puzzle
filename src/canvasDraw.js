class CanvasDraw{
    constructor(image,canvas,ctx,pi,dw,dh){        
        this.image = image;
        this.canvas = canvas;
        this.ctx = ctx;
        this.pi = pi;
        this.dw = dw;
        this.dh = dh;
    }
    
    // 화면 그리기
    draw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            for(let i =0; i<25;i++){
                this.ctx.drawImage(this.image,this.pi.puzzles[i].sx,this.pi.puzzles[i].sy,this.pi.sw,this.pi.sh,this.pi.puzzles[i].dx,this.pi.puzzles[i].dy,this.dw,this.dh);
            }
        this.drawGrid();
    }

    // 퍼즐 격판 그리기
    drawGrid(){        
        this.ctx.beginPath();
        for(let i = 1; i<7; i++){
            this.ctx.moveTo(this.dw,this.dh*i);
            this.ctx.lineTo(this.dw*6,this.dh*i);
            this.ctx.moveTo(this.dw*i,this.dh);
            this.ctx.lineTo(this.dw*i,this.dh*6);
        }
        this.ctx.stroke();
    }

    // 글 입력 하기
    drawText(text, font,x,y){
        this.ctx.font = font;
        this.ctx.fillStyle = "gray";
        this.ctx.fillText(text,x,y);
    }
}
export default CanvasDraw;