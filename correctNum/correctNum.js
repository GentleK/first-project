//랜덤번호지정
//번호입력후 go 버튼클릭
//번호가 맞으면 맞췄습니다.
//번호가 유저번호보다 작으면 다운
//번호가 유저번호보다 크면 업
//리셋버튼을 누르면 리셋
//5번 기회를 다 쓰면 게임끝
//1보다 작거나 100보다 큰 수를 입력하면 알려주고 기회소진하지 않음.
//이미 입력한 숫자를 다시 입력한 경우 알려주고 기회소진하지 않음.

let computerNum = 0;
let maxChances = 5;
let chances = maxChances;
let userNumHistory = [];
let gameOver = false;
let userInput = document.getElementById("user-Input");
let playResult = document.getElementById("play-Result");
let remainChance = document.getElementById("remain-chance");
let playButton = document.getElementById("play-Button");
let resetButton = document.getElementById("play-Reset");
let goBackButton = document.getElementById("go-back");
pickRandomNum();

userInput.addEventListener("focus", ()=>{
    userInput.value = "";
})

playButton.addEventListener("click", ()=>{
    if( userInput.value < 1 || userInput.value > 100 ){
        playResult.innerHTML = "1부터 100사이의 숫자를 입력하시오.";
    }else if( userNumHistory.includes(userInput.value) ){
        playResult.innerHTML = "이미 입력한 숫자입니다.";
    }else{
        if( computerNum == userInput.value ){
            playResult.innerHTML = "correct";
            gameOver = true;
        }else if( computerNum < userInput.value ){
            playResult.innerHTML = "down";
        }else if( computerNum > userInput.value ){
            playResult.innerHTML = "up";
        }
        chances--;
        remainChance.innerHTML = `남은기회 : ${chances}번`;
        userNumHistory.push(userInput.value);
        if( chances < 1 ){
            gameOver = true;
        }
        if( gameOver ){
            playResult.innerHTML = "game over";
            playButton.disabled = true;
        }
    }
});

resetButton.addEventListener("click", ()=>{
    userInput.value = "";
    chances = maxChances;
    pickRandomNum();
    playResult.innerHTML = "try correct";
    playButton.disabled = false;
    gameOver = false;
    userNumHistory = [];
});

function pickRandomNum(){
    computerNum = Math.floor(Math.random() * 100)+1;
    remainChance.innerHTML = `남은기회 : ${chances}번`;
    console.log("computerNum : ", computerNum);
}

goBackButton.addEventListener("click", ()=>{
    document.location.href = "../index.html";
});

