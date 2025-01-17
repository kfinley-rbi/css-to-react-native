import {
  IDENT,
  WORD,
  SUB_VAR,
  COLOR,
  LENGTH,
  UNSUPPORTED_LENGTH_UNIT,
  PERCENT,
  AUTO,
} from '../tokenTypes'
import border from './border'
import boxShadow from './boxShadow'
import flex from './flex'
import flexFlow from './flexFlow'
import font from './font'
import fontFamily from './fontFamily'
import placeContent from './placeContent'
import textDecoration from './textDecoration'
import textDecorationLine from './textDecorationLine'
import textShadow from './textShadow'
import transform from './transform'
import { directionFactory, parseShadowOffset } from './util'

const background = tokenStream => ({
  backgroundColor: tokenStream.expect(COLOR),
})
const borderColor = directionFactory({
  types: [COLOR],
  prefix: 'border',
  suffix: 'Color',
})
const borderRadius = directionFactory({
  directions: ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'],
  prefix: 'border',
  suffix: 'Radius',
})
const borderWidth = directionFactory({ prefix: 'border', suffix: 'Width' })
const margin = directionFactory({
  types: [SUB_VAR, LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT, AUTO],
  prefix: 'margin',
  convertToNB: true,
  allowSingle: true,
})
const padding = directionFactory({
  prefix: 'padding',
  convertToNB: true,
  allowSingle: true,
})
const fontVariant = tokenStream => ({
  fontVariant: [tokenStream.expect(IDENT)],
})
const fontWeight = tokenStream => ({
  fontWeight: tokenStream.expect(WORD), // Also match numbers as strings
})
const shadowOffset = tokenStream => ({
  shadowOffset: parseShadowOffset(tokenStream),
})
const textShadowOffset = tokenStream => ({
  textShadowOffset: parseShadowOffset(tokenStream),
})

export default {
  background,
  border: border(''),
  borderTop: border('Top'),
  borderBottom: border('Bottom'),
  borderLeft: border('Left'),
  borderRight: border('Right'),
  borderColor,
  borderRadius,
  borderWidth,
  boxShadow,
  flex,
  flexFlow,
  font,
  fontFamily,
  fontVariant,
  fontWeight,
  margin,
  padding,
  placeContent,
  shadowOffset,
  textShadow,
  textShadowOffset,
  textDecoration,
  textDecorationLine,
  transform,
}
