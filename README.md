# World Populations App

This application was written as a programming challenge from [Seegrid](https://seegrid.com/) in November, 2020. The challenge instructions are [here](https://github.com/gregsandell/world_populations/blob/dev/doc/Problem_Statement_Country_population_chart.pdf).  The code for the solution is at the public repo [gregsandell/world_populations](https://github.com/gregsandell/world_populations).

## Assumptions
1. Have Node.js v.14 installed with npm
2. Ports 3000 and 5000 are free on your computer

## Instructions
2. In terminal:  `nvm use` (assuming you have nvm installed)
3. In terminal:  `npm install`
4. In terminal:  `npm run dev`
5. In browser: Navigate to [localhost:3000](http://localhost:3000).


## Technology Choices
1. *React* for the frontend stack
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

1. The source dataset includes several non-country, aggregate populations, such as *Arab World* (ARB) and *High income* (HIC).  Although these are interesting I feel that they skew the results from the majority of country-based data, so I excluded them.
2. I reverse-sorted the years (2016 down to 1960) and made the latest year the default population.
3. In React Hooks, `useEffect()` calls come AFTER rendering, but in several cases my *useEffect()*'s make state variable changes, after which a render is desired.  I was able to accomplish this by wrapping the state changes in a short `setTimeout()`. I am not sure how reliable this technique is. 
4. I added two controls not specified in the original challenge, A date slider to control the range of populations included, and a *Bird's Eye View* checkbox.  The become visible when opening the *Bonus Features* accordion tab.  The specifics of these features are described with tooltip text in the live app.
5. Each bar contains a *title* attribute which will identify the bar on rollover.  Because browsers delay the appears of the title, it is not an effective user experience.  A tooltip rollover from [Material-ui](https://material-ui.com/components/tooltips/) was considered, but due to the size of the dataset, it imposed performance problems on the UI and was abandoned.

## Opportunities for improvement
1. The aggregate data (see above) could be included and included or suppressed according to a filter control. 
2. A delta plot showing the population differences between one year and another would be an interesting extra feature.
3. Improvement for the population slider (Bonus Feature):  because the large population countries (China, India, etc) are orders of magnitude larger than the majority of smaller-population countries, the slider would be more effective if it worked on a log scale.
