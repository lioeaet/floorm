import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm
}), 'baseOrm')

const childOrm = orm(() => ({
  childBase: baseOrm
}), 'childOrm')

const base = {
  id: 1,
  baseChild: {
    id: 1
  }
}

const child = {
  id: 1,
  childBase: { id: 1 },
}

baseOrm.put(base)
childOrm.put(child)
childOrm.put({
  id: 1,
  childBase: { id: 5, baseProp: 'yz' }
})
