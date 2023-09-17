class CanvasDraw{
    constructor(image,ctx,im,dw,dh){        
        this.image = image;
        this.ctx = ctx;
        this.im = im;
        this.dw = dw;
        this.dh = dh;
    }
    
    // 화면 그리기
    draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
            for(let i =0; i<25;i++){
                ctx.drawImage(image,im.puzzles[i].sx,im.puzzles[i].sy,im.sw,im.sh,im.puzzles[i].dx,im.puzzles[i].dy,dw,dh);
            }
        this.drawGrid();
    }

    // 퍼즐 격판 그리기
    drawGrid(){        
        ctx.beginPath();
        for(let i = 1; i<7; i++){
            ctx.moveTo(dw,dh*i);
            ctx.lineTo(dw*6,dh*i);
            ctx.moveTo(dw*i,dh);
            ctx.lineTo(dw*i,dh*6);
        }
        ctx.stroke();
    }

    // 글 입력 하기
    drawText(text, font,x,y){
        ctx.font = font;
        ctx.fillStyle = "gray";
        ctx.fillText(text,x,y);
    }
}
