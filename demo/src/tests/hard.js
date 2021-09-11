import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm
}), 'base')

const childOrm = orm(() => ({
  childBase: baseOrm,
  childBaseArr: [baseOrm],
  childInner: {
    childBaseInner: baseOrm
  }
}), 'child')

baseOrm.put({
  id: 1,
  baseChild: {
    id: 1
  }
})

childOrm.put({
  id: 1,
  prop: 'prop',
  childBase: {
    id: 1,
    basePropY: 'y'
  },
  childBaseArr: [{ id: 1, basePropArr: 'x' }, { id: 2, basePropArr: 'y' }, { id: 3, basePropArr: 'z' }],
  childInner: {
    childBaseInner: {
      id: 1,
      baseInner: 'inner'
    }
  }
})

childOrm.put({
  id: 1,
  childBase: {
    id: 1,
    prop: 'someZ'
  },
  childBaseArr: [{ id: 2, basePropArr: 'yz' }, { id: 1, basePropArr: 'x' }]
})

baseOrm.put({ id: 3, awdino: 'las' })

baseOrm.put({ id: 2, awdino: 'als' })
