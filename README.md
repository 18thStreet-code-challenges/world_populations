# World Populations App

This application was written as a programming challenge from [Seegrid](https://seegrid.com/) in November, 2020.  The code is at the public repo [gregsandell/world_populations](https://github.com/gregsandell/world_populations).  The instructions for the challenge are stored in the project at `./doc/Code_Challenge_FE_V1.pdf`.
## Assumptions
1. Have Node.js v.14 installed with npm
2. Ports 3000 and 5000 are free on your computer

## Instructions
2. In terminal:  `nvm use` (assuming you have nvm installed)
3. In terminal:  `npm install`
4. In terminal:  `npm run dev`
5. In browser: Navigate to [localhost:3000](http://localhost:3000).


## Technology Choices
1. *create-react-app* for scaffolding
2. Node.js *Express* for proxying requests to the Twitter REST api (port 5000)
3. *fetch* api for AJAX calls
4. React hooks

## Stylistic Preferences
1. I prefer the 'no semicolons' approach favored by [Standard JS](https://standardjs.com).
2. I prefer to have the server and React client code in a single project.
3.  I use a `jsconfig.json` to establish default import paths.  This avoids clumsy relative path imports such as:

```javascript
import Tag from '../containers/Tag'
```

## Special Challenges & Choices
This covers challenges I encountered, or choices I made that went beyond what was specifically stated in the instructions.  Note that there also inline comments in the code that describe decisions on a more granular level.

1. The source dataset includes several aggregate populations, such as 
2. Debouncing is by necessity a stateful mechanism.  The challenge is to prevent the debounce rendering from recreating the input field, because it will recreate the debounce with a fresh state. Seeing the complexity of solving this, I chose to go with the proven [react-debounce-input](https://www.npmjs.com/package/react-debounce-input) library.
3. In React Hooks, `useEffect()` calls come AFTER rendering, but in several cases my *useEffect()*'s make state variable changes, after which a render is desired.  I was able to accomplish this by wrapping the state changes in a short `setTimeout()`. I am not sure how reliable this technique is. 
6. The Twitter API param `max_id` was used to ensure that pressing *Load more* caused subsequent tweets to be loeaded and avoiding duplications.  The `id` field in the API uses integers larger than Javascript allows, so in order to perform math I had to use [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
7. I made a hashtag in the *Filter by hashtag* panel change color on click to show that it was selected.  The user can deselect the tag by clicking again.  
8. For simplicity I allow only one hashtag selectable at a time.  An *alert()* warns the user if they try select two.
9. The Twitter search api returns results for text found anywhere in the tweet, not just the text.  As a result, the text displayed in the output does not necessarily include the searched text.

