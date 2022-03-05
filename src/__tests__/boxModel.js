import transformCss from '..'

it('transforms margin, padding with 1 value', () => {
  expect(transformCss([['margin', '1px']])).toEqual({
    margin: '1px',
  })
  expect(transformCss([['padding', '1px']])).toEqual({
    padding: '1px',
  })
})

it('transforms margin, padding with 2 values', () => {
  expect(transformCss([['margin', '1px 2px']])).toEqual({
    marginX: '$0.5',
    marginY: '1px',
  })
  expect(transformCss([['padding', '1px 2px']])).toEqual({
    paddingX: '$0.5',
    paddingY: '1px',
  })
})

it('transforms margin, padding with 3 values', () => {
  expect(transformCss([['margin', '1px 2px 3px']])).toEqual({
    marginTop: '1px',
    marginRight: '$0.5',
    marginBottom: '3px',
    marginLeft: '$0.5',
  })
  expect(transformCss([['padding', '1px 2px 3px']])).toEqual({
    paddingTop: '1px',
    paddingRight: '$0.5',
    paddingBottom: '3px',
    paddingLeft: '$0.5',
  })
})

it('transforms margin, padding with 4 values', () => {
  expect(transformCss([['margin', '1px 2px 3px 4px']])).toEqual({
    marginTop: '1px',
    marginRight: '$0.5',
    marginBottom: '3px',
    marginLeft: '$1',
  })
  expect(transformCss([['padding', '1px 2px 3px 4px']])).toEqual({
    paddingTop: '1px',
    paddingRight: '$0.5',
    paddingBottom: '3px',
    paddingLeft: '$1',
  })
})

it('transforms margin, allowing unitless zero, percentages', () => {
  expect(transformCss([['margin', '0 0% 10% 100%']])).toEqual({
    marginTop: '0',
    marginRight: '0%',
    marginBottom: '10%',
    marginLeft: 'full',
  })
  expect(transformCss([['padding', '0 0% 10% 100%']])).toEqual({
    paddingTop: '0',
    paddingRight: '0%',
    paddingBottom: '10%',
    paddingLeft: 'full',
  })
})

it('transforms shorthand and overrides previous values', () => {
  expect(transformCss([['margin-top', '2px'], ['margin', '1px']])).toEqual({
    marginTop: '$0.5',
    margin: '1px',
  })
})

it('transforms margin shorthand with auto', () => {
  expect(transformCss([['margin', 'auto']])).toEqual({
    margin: 'auto',
  })
  expect(transformCss([['margin', '0 auto']])).toEqual({
    marginX: 'auto',
    marginY: '0',
  })
  expect(transformCss([['margin', 'auto 0']])).toEqual({
    marginX: '0',
    marginY: 'auto',
  })
  expect(transformCss([['margin', '2px 3px auto']])).toEqual({
    marginTop: '$0.5',
    marginRight: '3px',
    marginBottom: 'auto',
    marginLeft: '3px',
  })
  expect(transformCss([['margin', '10px auto 4px']])).toEqual({
    marginTop: '$2.5',
    marginRight: 'auto',
    marginBottom: '$1',
    marginLeft: 'auto',
  })
})

it('transforms border width', () => {
  expect(transformCss([['border-width', '1px 2px 3px 4px']])).toEqual({
    borderTopWidth: 1,
    borderRightWidth: 2,
    borderBottomWidth: 3,
    borderLeftWidth: 4,
  })
})

it('transforms border radius', () => {
  expect(transformCss([['border-radius', '1px 2px 3px 4px']])).toEqual({
    borderTopLeftRadius: 1,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 4,
  })
})
