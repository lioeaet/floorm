import React from 'react'

const FLAGS = {
  'Prussia': 'http://localhost:7337/img/prus.svg',
  'France': 'http://localhost:7337/img/fr.svg',
  'Russia': 'http://localhost:7337/img/rus.png'
}

const Flag = ({ country }) =>
  <img
    style={{ width: 20 }}
    src={FLAGS[country]}
    alt="flag"
  />

export default Flag
