import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm
}), 'base')

const childOrm = orm(() => ({
  childBase: baseOrm,
}), 'child')

const base = {
  id: 1,
  baseProp: 'baseProp',
  baseChild: {
    id: 1
  }
}

const child = {
  id: 1,
  childProp: 'childProp',
  childBase: {
    id: 1,
    x: 'y'
  }
}

baseOrm.put(base)
childOrm.put(child)
