# React Mastermind

A classic board game turned React App, with a twist! This game can be played with one player ass the React App itself is the mastermind.


## What's with this version?

t's the Mastermind app from where we left off in the State and Props lesson with a few additions

## Change log

### React state and props lesson
1. React app scaffolded
2. Small changes to `App.css`
3. Basic component structure defined with component boilerplates
4. The red border styling removed
5. An additional <ScoreButton> component has been defined, but not rendered yet
6. React import removed in component per the [latest update to React](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)

## React styling components lesson

1. `<NewGameButton>` now renders a `<button>` instead of a `<div>`.
   
2. A `getWinTries` helper function has been added to `<App>` and used to display data in the `<footer>` component's content.
   
3. The `<GuessScore>` component is now being passed the guess object's score as a prop. The score object in turn is then being used to generate an array of Perfect, Almost & Incorrect characters that is then subsequently mapped and displayed using `<div>` components.

