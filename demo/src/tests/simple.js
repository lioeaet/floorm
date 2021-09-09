import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm
}), 'base')

const childOrm = orm(() => ({
  childBase: baseOrm,
}), 'child')

baseOrm.put({
  id: 1,
  baseProp: 'baseProp',
  baseChild: {
    id: 1
  }
})

childOrm.put({
  id: 1,
  childProp: 'childProp',
  childBase: {
    id: 1,
    baseFromChild: 'y'
  }
})
