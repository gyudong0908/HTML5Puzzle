# HTML5Puzzle
## 소개
HTML5의 캔버스를 활용한 퍼즐게임입니다.
## 프로젝트 ppt
[HTML5 웹.pdf](https://github.com/gyudong0908/HTML5Puzzle/files/13682242/HTML5.pdf)
## 게임 화면
![image](https://github.com/gyudong0908/HTML5Puzzle/assets/121427661/a91f0b5e-0b98-425f-a7b6-bdba5520d46a)
## 어려웠던 점
1. 시간지연을 위한 promise사용
> 게임이 시작되거나 잘못된 위치에 두었을 경우 3초의 대기시간을 가지게 하고 싶었다. 이 부분을 promise를 사용하여 게임이 진행되지 않고 지연되게 구현할 수 있었다.
2. 객체지향적 프로그래밍에 대한 어려움
> 처음에 코드를 작성했을 때는 한 파일에 모든 코드를 다 작성하였다. 그러니까 코드가 너무 길어 수정도 어려웠고 오류가 발생해도 해당 지점을 발견하는 것이 어려웠다. 이 부분을 객체지향적으로 프로그래밍을 해서 파일을 나누고 코드를 분리하고 싶었으나 해당 부분에서 많은 어려움을 겪었다.
3. Canvas의 최적화
>  canvas의 경우 연산을 하는 부분은 퍼즐을 잡고 움직였을 때, 밖에 없었다. 하지만 처음엔 버벅이지 않았지만 플레이시간이 길어질 수록 게임이 버벅였고 해당 이유를 찾기위해 고민하였다. 따라서 퍼즐이 움직였을때의 코드를 유심히 살펴보면서 오류를 발견하게 되었다. 오류의 위치는 역시 퍼즐의 격자를 그리는 부분이었고 처음엔 beginPath를 사용하지않고 퍼즐의 격자를 그렸으나 그렇게 할경우 전의 정보를 기억해서 이어서 그려지기 때문에 게임을 진행 할 수록 누적이되어 성능의 문제가 발생하는 것이었다. 해당 부분에 brginPath를 사용하여 동작하니 버벅임이 사라지게 되었다.
```javascript
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
```
## 배웠던 점
1. promise의 사용법과 사용이유
2. 코드 구현 전 설계에 대한 중요성
