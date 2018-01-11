let currentGame = undefined
let turn = 0
let turnToken = ""
let board = ["", "", "", "", "", "", "", "", ""]
let winner = ""
let WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6] ]

$(document).ready(function(){
  attachListeners()
})

function attachListeners() {
  $("#save").on("click", function(e){
    e.preventDefault()
    saveGame()
  })

  $("#previous").on("click", function(e){  // do after you get Xs and Ys on board
    e.preventDefault()
    previousGames()
  })

  $("#clear").on("click", function(e){
    e.preventDefault()
    clearGame()
  })

  $('td').on("click", function(){
    if(!$.text(this)){
      doTurn(this)
    }
  })
}

function doTurn(thatMove) {
  updateState(thatMove)
  turn += 1
  if(checkWinner()) {
    saveGame()
    clearGame()
  } else if(turn === 9) {
    setMessage('Still No Winner')
    saveGame()
    clearGame()
  }
}

function player() {
  if(turn % 2) {
    return "O"
  } else {
    return "X"
  }
}



function updateState(thatMove){
  if ($(thatMove).text() === '') {
    $(thatMove).text(player())
    board[thatMove.id] = player()
  } else {
    $(thatMove).click(false)
    setMessage("That space is taken. Please choose another.")
  }
}

function setMessage(string) {
  $("#message").text(string)
}


function checkWinner() {
  for(let i = 0; i < WINNING_COMBOS.length -1; i++){
      var place1 = WINNING_COMBOS[i][0]
      var place2 = WINNING_COMBOS[i][1]
      var place3 = WINNING_COMBOS[i][2]

      if(board[place1]  != "" && board[place1] === board[place2] && board[place2] === board[place3]){
        winner = board[place1]
        return true
      }
  }
  return false
}

function saveGame() {
  gameData = { state: board }

  if (currentGame) {
    $.get({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: gameData
    })
  } else {
    $.post('/games', gameData, function(game){
      currentGame = game.data.id
      $('#games').append('<button id="gameid-${game.data.id}">${game.data.id}</button><br>')
    })
  }
}

function previousGames() {
  $('#games').empty();
  $.get('/games', function(savedGames){
    if (savedGames.data.length) {
      savedGames.data.forEach(function(game){
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        $(`#gameid-${game.id}`).on('click', function(){getGame(game.id)});
      });
    }
  });
}

function getGame(gameId) {
  setMessage('')

  $.get(`/games/${gameId}`, function(game){
    let state = game.data.attributes.state
    let id = game.data.id

    for(let i = 0; i < 9; i++){
      $(`#${i}`).text(`${state[i]}`)
      board[i] = state[i]
    }


    turn = state.join('').length;
    currentGame = id;
  })
}

function clearGame(){
  $('#message').text('')
  turn = 0
  currentGame = 0
  $('td').empty()
  board = ["", "", "", "", "", "", "", "", ""]
}

function currentBoard() {
  return board
}
