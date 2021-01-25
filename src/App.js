//useEffect for ajax request in react
import { useState, useEffect } from "react";
import './App.css';

import GamePage from './pages/GamePage/GamePage';
import SettingsPage from './pages/SettingsPage/SettingsPage';

import { Route, Switch } from 'react-router-dom';

import { fetchScoreData } from './services/scoresService';


function App (){

    const colors = {
      Easy: ['#7CCCE5', '#FDE47F', '#E04644', '#B576AD'],
      Moderate: ['#7CCCE5', '#FDE47F', '#E04644', '#B576AD', '#B7D968'],
      Difficult: ['#7CCCE5', '#FDE47F', '#E04644', '#B576AD', '#B7D968', '#555E7B']
    };


    const [selColorIdx, setColorIdx] = useState(0);

    const [gameState, setGameState] = useState(getInitialState());
    
    /* helper functions */

    /*
      refactor to accept computed values when difficulty needs to change
      add params for the values and set them to a default if initial page
      load
    */ 
    function getInitialState(numColors = 4, difficulty = 'Easy') {
      return {
        guesses: [getNewGuess()],
        code: genCode(numColors),
        difficulty,
        elapsedTime: 0,
        isTiming: true
      };
    }

    /*
      refactor to accept number of colors we're working with 
      depending on level
    */ 
    function genCode(numColors) {
      return new Array(4).fill().map(() => Math.floor(Math.random() * numColors));
    }


    function getNewGuess() {
      return {
        code: [null, null, null, null],
        score: {
          perfect: 0,
          almost: 0
        }
      };
    }

    function getWinTries() {
      // if winner, return num guesses, otherwise 0 (no winner)
      let lastGuess = gameState.guesses.length - 1;
      return gameState.guesses[lastGuess].score.perfect === 4 ? lastGuess + 1 : 0;
    }
    
    const winTries = getWinTries();


    function handlePegClick(pegIdx) {
      // make copy of gameState
      const gameStateCopy = {...gameState};

      // get current guess index
      const currentGuessIdx = gameStateCopy.guesses.length - 1;

      // set the current guesses' code to selColIdx
      gameStateCopy.guesses[currentGuessIdx].code[pegIdx] = selColorIdx;

      // set state to new version
      setGameState(gameStateCopy);

    }

    /*
      refactor to maintain current level selected
    */ 
    function handleNewGameClick() {
      
      const difficulty = gameState.difficulty;
      const numColors = colors[difficulty].length;

      setGameState(getInitialState(numColors, difficulty));
    }

    /*
      helper function for accepting selected level,
      computing number of colors based on level and
      initializing new game with new level and number
      of colors for generating a new code
    */ 
    function handleDifficultyChange(level) {
      
      const numColors = colors[level].length;
      setGameState(getInitialState(numColors, level))

    }

    function handleTimerUpdate() {
      setGameState(prevGameState => ({
        ...prevGameState,
        elapsedTime: prevGameState.elapsedTime + 1
      }))
    }

    function handleScoreClick() {
      // make copy of gameState
      const gameStateCopy = {...gameState};

      // get current guess index - (shortcut variable)
      const currentGuessIdx = gameStateCopy.guesses.length - 1; 

      // make a reference to current guess in the gameState copy - (shortcut variable)
      const currentGuess = gameState.guesses[currentGuessIdx];
  
      /* 
        create "working" copies of the "guessed" code and the secret
        code to modify hopefully without messing up the actual ones in state copy
      */ 

      const guessCodeCopy = [...currentGuess.code];
      const secretCodeCopy = [...gameStateCopy.code];
  
      let perfect = 0, almost = 0;
  
      // first pass computes number of "perfect"
      guessCodeCopy.forEach((code, idx) => {
        if (secretCodeCopy[idx] === code) {
          perfect++;
          /*
           ensure same choice is not matched again
           by updating both elements in the "working"
           arrays to null
          */ 
          guessCodeCopy[idx] = secretCodeCopy[idx] = null;
        }
      });
  
      // second pass computes number of "almost"
      guessCodeCopy.forEach((code, idx) => {
        if (code === null) return;
        let foundIdx = secretCodeCopy.indexOf(code);
        if (foundIdx > -1) {
          almost++;
          //ensure same choice is not matched again
          secretCodeCopy[foundIdx] = null;
        }
      });
  
      // update the current guess score using the reference we created above
      currentGuess.score.perfect = perfect;
      currentGuess.score.almost = almost;
  
  
      // add a new guess if not a winner
      if (perfect !== 4) gameStateCopy.guesses.push(getNewGuess());
  
      // finally, update the state to the updated version
      setGameState(gameStateCopy);
    }

    // another cleanly written function with async/await
    async function getScores() {
      console.log('get scores functionis running')
      const data = await fetchScoreData();
      console.log(data) // we should see our scores data in the browser console
      }

      // [] as second argument(wont keep running getScores, only at first load) skip block of code prior to [] ie getScores()
      useEffect(()=>{
        getScores();
      }, []);

    return (
      <div className="App">
        <header className='header-footer'>R E A C T &nbsp;&nbsp;&nbsp;M A S T E R M I N D</header>
        <Switch>
          <Route exact path='/' render={() =>
            <GamePage
              winTries={winTries}
              colors={colors[gameState.difficulty]}
              selColorIdx={selColorIdx}
              guesses={gameState.guesses}
              setColorIdx={setColorIdx}
              handleNewGameClick={handleNewGameClick}
              handlePegClick={handlePegClick}
              handleScoreClick={handleScoreClick}
              handleTimerUpdate={handleTimerUpdate} 
              elapsedTime={gameState.elapsedTime}
              isTiming={gameState.isTiming}
            />
          } />
          <Route exact path="/settings" render={props => 
            <SettingsPage 
              {...props}
              colorsLookup={colors}
              difficulty={gameState.difficulty} 
              handleDifficultyChange={handleDifficultyChange}
            />
          }/>
        </Switch>
      </div>
    );
}

export default App;