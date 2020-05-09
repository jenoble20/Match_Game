let MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/
  $(document).ready(function(){
    MatchGame.renderCards(MatchGame.generateCardValues(), $('#game-board'));
  });

  
/*
  Generates and returns an array of matching card values.
 */

MatchGame.generateCardValues = function () {
  const ordered = [];
  for(let x=1; x<=8; x++){
    ordered.push(x);
    ordered.push(x);
  }
  let unordered = [];
  while(ordered.length > 0){
    let rand = Math.floor(Math.random()*(ordered.length-1));
    unordered.push(ordered[rand]);
    ordered.splice(rand,1);
  }
  return unordered;
};

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/

MatchGame.renderCards = function(cardValues, $game) {
  let correct = 0;
  let clicks = 0;
  let ratio = 0.0;
  $game.empty();
  $game.data('flipped-cards', []);
  const cardColors = ['hsl(25,85%,65%)','hsl(55,85%,65%)','hsl(90,85%,65%)',
                      'hsl(160,85%,65%)','hsl(220,85%,65%)','hsl(265,85%,65%)',
                      'hsl(310,85%,65%)','hsl(360,85%,65%)'];

  let gridX = 0;
  let gridY = 0;
  let cardsArray = [];
  for (let i = 0; i < cardValues.length; i++) {

    if (gridX == 4) {//Iterates to the next row of the grid
      gridX = 0;
      gridY++;
    }
    let $card = $('<div class="card"></div>');
    $card.data({
      value: cardValues[i],
      flipped: false,
      color: cardColors[cardValues[i] - 1],
      position: i
    });
    $game.append($card);
    //Assign a position on the grid for the current card.
    MatchGame.assignPosition($card, gridX, gridY);
    cardsArray.push($card);
    gridX++;
  }

  MatchGame.setVisible(cardsArray);
  
  $('.card').click(function() {
    clicks++;
    correct = MatchGame.flipCard($(this), $('#game-board'), correct);
    ratio = MatchGame.calculateRatio(correct,clicks);
  });
}

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($card, $game, c) {
  if($card.data("flipped")){
    return c;
  }

  $card.text($card.data('value'));
  $card.css('background-color', $card.data('color'));
  $card.data('flipped', true);

  $game.data('flipped-cards').push($card);
  if($game.data('flipped-cards').length === 2){
    let cardOne = $game.data('flipped-cards')[0];
    let cardTwo = $game.data('flipped-cards')[1];

    if(cardOne.data('value')===cardTwo.data('value')){
      cardOne.css({
        'background-color': 'rgb(153,153,153)',
        color: 'rgb(204,204,204)'
      });
      cardTwo.css({
        'background-color': 'rgb(153,153,153)',
        color: 'rgb(204,204,204)'
      });
      c++;
    }else{
      window.setTimeout(function(){
        cardOne.css('background-color', 'rgb(32,64,86)');
        cardOne.text('');
        cardOne.data('flipped', false);
        cardTwo.css('background-color', 'rgb(32,64,86)');
        cardTwo.text('');
        cardTwo.data('flipped', false);
      },500)
    }
    $game.data('flipped-cards', []);
    MatchGame.checkForWin($game);
  }
  return c;
};

MatchGame.checkForWin = function($game){
  let count = 0;
  $game.children('.card').each(function(){
    if($(this).data('flipped')){
      count++;
    }
  });
  if(count>=16){
    const banner = `<div id='win-banner'>
                      <h1>Congratulations! You win!</h1>
                    </div>`
     $('#game-container').prepend(banner)
     $("#instructions").append('<button id="restart">Play Again!</button>')
  
     $('#restart').click(function(){
      
      $('#win-banner').remove();
      MatchGame.renderCards(MatchGame.generateCardValues(), $('#game-board'));
      $(this).remove();
    });
  }
};

MatchGame.calculateRatio = function(num, den){
  return Math.floor((num/den)*100);
}

MatchGame.setVisible = function(cardArray, iteration = 0){
  cardArray[iteration].css('opacity', '1');
  iteration++;
  if(iteration<cardArray.length){
    setTimeout(function(){
      MatchGame.setVisible(cardArray, iteration)
    }, 200);
  }
}

MatchGame.assignPosition = function(card, x, y){
  let xx = x+1;
  let yy = y+1;
  x = x.toString();
  xx = xx.toString();
  y = y.toString();
  yy= yy.toString();
  card.css({
    'grid-row': `${y} / ${yy}`,
    'grid-column': `${x} / ${xx})`
  })
}
