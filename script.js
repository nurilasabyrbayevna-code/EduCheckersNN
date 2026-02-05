// Навигация
const sections = {
    home: document.getElementById('home'),
    game: document.getElementById('game'),
    rules: document.getElementById('rules'),
    teacher: document.getElementById('teacher')
};

function toggleSections(show){
    for(let k in sections) sections[k].classList.add('hidden');
    sections[show].classList.remove('hidden');
}
function showHome(){ toggleSections('home'); resetGame(); }
function showRules(){ toggleSections('rules'); }
function startGame(){ toggleSections('game'); initBoard(); }
function showTeacher(){ toggleSections('teacher'); }

// Дыбыстар
const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
const moveSound = new Audio('sounds/move.mp3');
const captureSound = new Audio('sounds/capture.mp3');

// Ойын логикасы
let boardState=[], selectedPiece=null;

// 🔹 40 сұрақ
const questions = [
  {piece:'W1', question:'«Мен барамын, … сен үйде қаласың» – дұрыс шылау?', options:['бірақ','және','немесе'], answer:'бірақ'},
  {piece:'W2', question:'«Ол кітап оқиды, … сабаққа дайындалады» – дұрыс шылау?', options:['және','немесе','бірақ'], answer:'және'},
  {piece:'W3', question:'«Сен оқыдың ба, … мен де оқыдым» – дұрыс шылау?', options:['де','па','ме'], answer:'де'},
  {piece:'W4', question:'«Ол жүгірді, … мен кідірмедім» – дұрыс шылау?', options:['және','бірақ','немесе'], answer:'және'},
  {piece:'W5', question:'«Мен тамақ іштім, … сен әлі ашсың» – дұрыс шылау?', options:['бірақ','немесе','және'], answer:'бірақ'},
  {piece:'W6', question:'«Ол ән айтты, … би де биледі» – дұрыс шылау?', options:['және','бірақ','немесе'], answer:'және'},
  {piece:'W7', question:'«Сен барасың ба, … мен қаламын» – дұрыс шылау?', options:['бірақ','және','немесе'], answer:'бірақ'},
  {piece:'W8', question:'«Мен дайындалдым, … сен де дайындалдың ба?» – дұрыс шылау?', options:['және','немесе','бірақ'], answer:'және'},
  {piece:'W9', question:'«Ол оқиды, … ойынға барады» – дұрыс шылау?', options:['бірақ','немесе','және'], answer:'немесе'},
  {piece:'W10', question:'«Мен кітап оқимын, … сен де оқисың» – дұрыс шылау?', options:['де','па','бірақ'], answer:'де'},

  {piece:'B1', question:'«Мен барамын, … сен қаласың ба?» – дұрыс шылау?', options:['бірақ','және','немесе'], answer:'бірақ'},
  {piece:'B2', question:'«Ол кітап оқиды, … сабаққа дайындалады» – дұрыс шылау?', options:['және','немесе','бірақ'], answer:'және'},
  {piece:'B3', question:'«Сен дайынсың ба, … мен де дайынмын» – дұрыс шылау?', options:['де','па','ме'], answer:'де'},
  {piece:'B4', question:'«Ол жүгірді, … мен де шықтым» – дұрыс шылау?', options:['және','бірақ','немесе'], answer:'және'},
  {piece:'B5', question:'«Мен тамақ іштім, … сен әлі ашсың» – дұрыс шылау?', options:['бірақ','немесе','және'], answer:'бірақ'},
  {piece:'B6', question:'«Ол ән айтты, … би де биледі» – дұрыс шылау?', options:['және','бірақ','немесе'], answer:'және'},
  {piece:'B7', question:'«Сен барасың ба, … мен қаламын» – дұрыс шылау?', options:['бірақ','және','немесе'], answer:'бірақ'},
  {piece:'B8', question:'«Мен дайындалдым, … сен де дайындалдың ба?» – дұрыс шылау?', options:['және','немесе','бірақ'], answer:'және'},
  {piece:'B9', question:'«Ол оқиды, … ойынға барады» – дұрыс шылау?', options:['бірақ','немесе','және'], answer:'немесе'},
  {piece:'B10', question:'«Мен кітап оқимын, … сен де оқисың» – дұрыс шылау?', options:['де','па','бірақ'], answer:'де'},

  {piece:'W11', question:'«Мен келемін, … сен де барасың ба?» – дұрыс шылау?', options:['бірақ','және','немесе'], answer:'бірақ'},
  {piece:'W12', question:'«Ол ойнады, … мен де қатысты» – дұрыс шылау?', options:['және','бірақ','немесе'], answer:'және'},
  {piece:'W13', question:'«Сен дайынсың ба, … мен де дайынмын» – дұрыс шылау?', options:['де','па','ме'], answer:'де'},
  {piece:'W14', question:'«Ол ән айтты, … би биледі» – дұрыс шылау?', options:['және','бірақ','немесе'], answer:'және'},
  {piece:'W15', question:'«Мен тамақ іштім, … сен әлі ашсың» – дұрыс шылау?', options:['бірақ','немесе','және'], answer:'бірақ'},
  {piece:'W16', question:'«Ол жүгірді, … мен де шықтым» – дұрыс шылау?', options:['және','бірақ','немесе'], answer:'және'},
  {piece:'W17', question:'«Сен барасың ба, … мен қаламын» – дұрыс шылау?', options:['бірақ','және','немесе'], answer:'бірақ'},
  {piece:'W18', question:'«Мен дайындалдым, … сен де дайындалдың ба?» – дұрыс шылау?', options:['және','немесе','бірақ'], answer:'және'},
  {piece:'W19', question:'«Ол оқиды, … ойынға барады» – дұрыс шылау?', options:['бірақ','немесе','және'], answer:'немесе'},
  {piece:'W20', question:'«Мен кітап оқимын, … сен де оқисың» – дұрыс шылау?', options:['де','па','бірақ'], answer:'де'}
];

// 🔹 Тақта құру және шашка орналастыру
function initBoard(){
    const board = document.getElementById('board');
    board.innerHTML='';
    boardState = Array(64).fill(null);
    for(let i=0;i<64;i++){
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if(Math.floor(i/8)%2===i%2) cell.classList.add('black'); else cell.classList.add('white');
        cell.dataset.index = i;
        board.appendChild(cell);
    }

    const whiteStart=[1,3,5,7,8,10,12,14,17,19,21,23,24,26,28,30,33,35,37,39];
    const blackStart=[40,42,44,46,49,51,53,55,56,58,60,62,41,43,45,47,50,52,54,57,59,61];

    whiteStart.forEach((i,j)=>placePiece(i,'white','W'+(j+1)));
    blackStart.forEach((i,j)=>placePiece(i,'black','B'+(j+1)));

    enableDragDrop();
}

// 🔹 Шашка қою
function placePiece(index,color,id){
    const cell=document.querySelector(`.cell[data-index='${index}']`);
    const piece=document.createElement('div');
    piece.classList.add('piece',color);
    piece.id=id;
    piece.draggable = true;
    cell.appendChild(piece);
    boardState[index]=id;
}

// 🔹 Drag-and-Drop
let dragSourceIndex = null;
function enableDragDrop(){
    document.querySelectorAll('.piece').forEach(p=>{
        p.addEventListener('dragstart', e=>{
            dragSourceIndex = [...document.querySelectorAll('.cell')].findIndex(c=>c.contains(e.target));
        });
    });
    document.querySelectorAll('.cell').forEach(cell=>{
        cell.addEventListener('dragover', e=> e.preventDefault());
        cell.addEventListener('drop', e=>{
            if(dragSourceIndex===null) return;
            const targetIndex = [...document.querySelectorAll('.cell')].indexOf(cell);
            const pieceId = boardState[dragSourceIndex];
            if(!pieceId) return;
            showQuestionForPiece(pieceId,targetIndex);
            dragSourceIndex=null;
        });
    });
}

// 🔹 Сұрақ көрсету
function showQuestionForPiece(pieceId,targetIndex){
    const q = questions.find(q=>q.piece===pieceId);
    if(!q){ movePiece(pieceId,targetIndex); return; }

    const qt=document.getElementById('question-text');
    const ansDiv=document.getElementById('answers');
    qt.textContent=q.question;
    ansDiv.innerHTML='';
    q.options.forEach(opt=>{
        const btn=document.createElement('button');
        btn.textContent=opt;
        btn.onclick=()=>checkAnswer(opt,q.answer,pieceId,targetIndex);
        ansDiv.appendChild(btn);
    });
}

// 🔹 Жауап тексеру
function checkAnswer(selected,correct,pieceId,targetIndex){
    if(selected===correct){ correctSound.play(); movePiece(pieceId,targetIndex); }
    else{ wrongSound.play(); alert('Қате жауап!'); }
}

// 🔹 Шашка қозғалыс
function movePiece(id,targetIndex){
    const oldIndex = boardState.findIndex(p=>p===id);
    if(boardState[targetIndex]){
        document.getElementById(boardState[targetIndex]).remove();
        captureSound.play();
    }
    const oldCell=document.querySelector(`.cell[data-index='${oldIndex}']`);
    oldCell.innerHTML='';
    const color = id[0]==='W'?'white':'black';
    placePiece(targetIndex,color,id);
    moveSound.play();
    selectedPiece=null;
    checkWinner();
}

// 🔹 Жеңімпаз
function checkWinner(){
    const whiteLeft = document.querySelectorAll('.piece.white').length;
    const blackLeft = document.querySelectorAll('.piece.black').length;
    if(whiteLeft===0 || blackLeft===0){
        document.getElementById('winner').classList.remove('hidden');
        document.getElementById('winner').textContent = whiteLeft===0 ? 'Қара шашка жеңді!' : 'Ақ шашка жеңді!';
    }
}

// 🔹 Ойын қайта бастау
function resetGame(){
    boardState=[]; selectedPiece=null;
    document.getElementById('winner').classList.add('hidden');
    document.getElementById('board').innerHTML='';
    document.getElementById('question-text').textContent='';
    document.getElementById('answers').innerHTML='';
}
