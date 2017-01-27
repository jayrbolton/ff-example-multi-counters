const R = require('ramda')
const h = require('flimflam/h')
const flyd = require('flimflam/flyd')
const render = require('flimflam/render') 

const init = () => {
  const appendCounter$ = flyd.stream()
  const add$ = flyd.stream()
  
  // counts$ is a stream countaining an array of ints representing the total count for each counter
  const counts$ = flyd.scanMerge([
    [appendCounter$,   appendCounter]
  , [add$,             addToCount]
  ], [])

  return { counts$, appendCounter$, add$ }
}


const appendCounter = (counts, _) => R.append(0, counts)

const addToCount = (counts, [idx, n]) =>
  R.update(idx, counts[idx] + n, counts)

const view = state =>
  h('body', [
    h('h1', 'Multiple counters!')
  , multiCounters(state)
  , h('button', {on: {click: state.appendCounter$}}, 'Add counter')
  ])

const multiCounters = state =>
  h('div', R.addIndex(R.map)(counter(state), state.counts$()))

const counter = state => (count, idx) =>
  h('p', [
    'Count: ' + count
  , h('button', {on: {click: [state.add$, [idx, 1]]}},  '+')
  , h('button', {on: {click: [state.add$, [idx, -1]]}}, '-')
  ])

render(view, init(), document.body)
