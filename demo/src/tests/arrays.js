import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm
}), 'base')

const childOrm = orm(() => ({
  childBase: baseOrm,
  childBaseArr: [baseOrm],
  inner: {
    another: baseOrm
  }
}), 'child')

childOrm.put({
  id: 1,
  childBaseArr: [{ id: 1, baseProp: 'x' }, { id: 2, baseProp: 'y' }, { id: 3, baseProp: 'z' }],
})

childOrm.put({
  id: 1,
  childBaseArr: [{ id: 2, baseProp: 'yz' }, { id: 1, baseProp: 'x' }]
})
