/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import parse from 'postcss-value-parser'
import camelizeStyleName from 'camelize'
import transforms from './transforms/index'
import devPropertiesWithoutUnitsRegExp from './devPropertiesWithoutUnitsRegExp'
import TokenStream from './TokenStream'
import { parseValue } from './transforms/nbMappings'

// Note if this is wrong, you'll need to change tokenTypes.js too
const numberOrLengthRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)(?:px|rem)?$/i
const numberOnlyRe = /^[+-]?(?:\d*\.\d*|[1-9]\d*)(?:e[+-]?\d+)?$/i
const boolRe = /^true|false$/i
const nullRe = /^null$/i
const undefinedRe = /^undefined$/i

const PropsToConvertToNB = ['margin', 'padding', 'height', 'width']

// const DEBUG = true
const DEBUG = false
const debugLog = (...values) => DEBUG && console.log(...values)

// Undocumented export
export const transformRawValue = (propName, value) => {
  debugLog(`transformRawValue propName: `, propName, value)
  const needsUnit = !devPropertiesWithoutUnitsRegExp.test(propName)
  const isNumberWithoutUnit = numberOnlyRe.test(value)
  if (needsUnit && isNumberWithoutUnit) {
    // eslint-disable-next-line no-console
    debugLog(`Expected style "${propName}: ${value}" to contain units`)
  }
  if (!needsUnit && value !== '0' && !isNumberWithoutUnit) {
    // these are TEMP variable substitutions in the caller
    if (!value.includes('substitution__')) {
      // eslint-disable-next-line no-console
      debugLog(`Expected style "${propName}: ${value}" to be unitless`)
    }
  }

  const numberMatch = value.match(numberOrLengthRe)

  const convertToNB = PropsToConvertToNB.some(v => propName.includes(v))

  if (numberMatch !== null) return parseValue(numberMatch[0], convertToNB)

  const boolMatch = value.match(boolRe)
  if (boolMatch !== null) return boolMatch[0].toLowerCase() === 'true'

  const nullMatch = value.match(nullRe)
  if (nullMatch !== null) return null

  const undefinedMatch = value.match(undefinedRe)
  if (undefinedMatch !== null) return undefined

  return value
}

const baseTransformShorthandValue = (propName, value) => {
  const ast = parse(String(value))
  const tokenStream = new TokenStream(ast.nodes)
  const fn = transforms[propName]
  const res = fn(tokenStream)
  return res
}

const transformShorthandValue = (propName, value) => {
  debugLog(`> transformShorthandValue propName: `, propName, value)
  try {
    return baseTransformShorthandValue(propName, value)
  } catch (e) {
    throw new Error(`Failed to parse declaration "${propName}: ${value}"`)
  }
}

export const getStylesForProperty = (propName, inputValue, allowShorthand) => {
  const isRawValue = allowShorthand === false || !(propName in transforms)
  debugLog(`> getStylesForProperty`, propName, inputValue, allowShorthand)
  let value = inputValue
  try {
    if (typeof inputValue === 'string') {
      value = inputValue.trim()
    }
  } catch (err) {
    throw new Error(`inputValue: ${propName}: ${inputValue}`)
  }

  const propValues = isRawValue
    ? { [propName]: transformRawValue(propName, value) }
    : transformShorthandValue(propName, value)

  debugLog(`> getStylesForProperty propValues`, propValues)

  return propValues
}

export const getPropertyName = propName => {
  const isCustomProp = /^--\w+/.test(propName)
  if (isCustomProp) {
    return propName
  }
  return camelizeStyleName(propName)
}

export default (rules, shorthandBlacklist = []) =>
  rules.reduce((accum, rule) => {
    const propertyName = getPropertyName(rule[0])
    const value = rule[1]
    const allowShorthand = shorthandBlacklist.indexOf(propertyName) === -1
    return Object.assign(
      accum,
      getStylesForProperty(propertyName, value, allowShorthand)
    )
  }, {})
