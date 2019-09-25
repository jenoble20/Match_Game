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
  $game.empty();
  $game.data('flipped-cards', []);
  const cardColors = ['hsl(25,85%,65%)','hsl(55,85%,65%)','hsl(90,85%,65%)',
                      'hsl(160,85%,65%)','hsl(220,85%,65%)','hsl(265,85%,65%)',
                      'hsl(310,85%,65%)','hsl(360,85%,65%)'];


  for(let i=0; i<cardValues.length; i++){
    let $card = $('<div class="card col-lg-3"></div>');
    $card.data({
      value: cardValues[i],
      flipped: false,
      color: cardColors[cardValues[i]-1]
    });
    $game.append($card);
  }
  $('.card').click(function() {
    MatchGame.flipCard($(this), $('#game-board'));
  });
}

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($card, $game) {
  if($card.data("flipped")){
    return
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
