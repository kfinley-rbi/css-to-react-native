/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
const numberOrLengthRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)((?:px|rem))?$/i

export const parseValue = value => {
  let v = value
  const p = String(value).match(numberOrLengthRe)
  if (p && p[1]) {
    // Convert rem to pixel
    if (p[2] === 'rem') {
      const asNum = parseFloat(String(p[1]), 10)
      if (!isNaN(asNum)) {
        v = Math.floor(asNum * 16)
      }
    } else {
      v = p[1]
    }
  }
  // eslint-disable-next-line no-use-before-define
  const nbPadding = paddingToNBmap[String(v)]
  if (nbPadding) {
    return nbPadding
  }

  return `${v}px`
}

export const paddingToNBmap = {
  '0': '0',
  '2': '$0.5',
  '4': '$1',
  '6': '$1.5',
  '8': '$2',
  '10': '$2.5',
  '12': '$3',
  '14': '$3.5',
  '16': '$4',
  '20': '$5',
  '24': '$6',
  '28': '$7',
  '32': '$8',
  '36': '$9',
  '40': '$10',
  '48': '$12',
  '56': '$13.5',
  '64': '$16',
  '80': '$20',
  '96': '$24',
  '128': '$32',
  '160': '$40',
  '192': '$48',
  '224': '$56',
  '256': '$64',
  '288': '$72',
  '320': '$80',
  '384': '$96',
  '50%': '1/2',
  '33.333%': '1/3',
  '66.666%': '2/3',
  '25%': '1/4',
  '75%': '3/4',
  '20%': '1/5',
  '40%': '2/5',
  '60%': '3/5',
  '80%': '4/5',
  '16.666%': '1/6',
  '83.333%': '5/6',
  '100%': 'full',
}
