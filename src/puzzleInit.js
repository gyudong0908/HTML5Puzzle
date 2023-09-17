class PuzzleInit{
    image;
    sw;
    sh;
    // 그림이 처음에 배치 될 위치들
    pictureCorrectPosition = [];
    puzzles = [];
    pictureStartPosition = [];
    
    constructor(image){
        this.image = image;
        this.setCrruentPosition();
        this.setStartPosition();
        this.splitImageIntoGrid();
        this.setPictureIntoSide();
    };

    // 이미지 분할 정보 저장
    splitImageIntoGrid() {
        this.sw = this.image.width / 5
        this.sh = this.image.height / 5
        let i = 0;
        // 이미지를 분할하여 각 Canvas에 표시
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {                
                this.puzzles.push({
                    sx : col * this.sw,
                    sy : row * this.sh,
                    dx : this.pictureCorrectPosition[i][0],
                    dy : this.pictureCorrectPosition[i][1],
                    position : null
                });                
                i++;
            }
        }
    }

    // 정답 위치 설정
    setCrruentPosition(){
        for(let i = 1; i<6;i++){
            for(let j = 1; j<6; j++){
                this.pictureCorrectPosition.push([100*j,100*i])
            }
        }
    }

    // 초기 위치 설정
    setStartPosition(){
        for(let i = 0; i<7; i++){
            this.pictureStartPosition.push([100*i,0]);
        }
        for(let i = 1; i<7; i++){
            this.pictureStartPosition.push([600,100*i]);
        }
        for(let i = 0; i<6; i++){
            this.pictureStartPosition.push([100*i,600]);
        }
        for(let i = 1; i<6; i++){
            this.pictureStartPosition.push([0,100*i]);
        }
    }
    
    setPictureIntoSide(){
        let puzzleGamePosition = [];
        while(puzzleGamePosition.length < 24){
            let rndNum = Math.floor(Math.random()*25);
            if(puzzleGamePosition.indexOf(rndNum) === -1){
                puzzleGamePosition.push(rndNum);
            }
        }
        for(let position of puzzleGamePosition){
            let index = puzzleGamePosition.indexOf(position);
            this.puzzles[position].dx = this.pictureStartPosition[index][0];
            this.puzzles[position].dy = this.pictureStartPosition[index][1];
            this.puzzles[position].position = index;
        }
    }
        
}