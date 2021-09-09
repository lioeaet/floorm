import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm
}), 'base')

const childOrm = orm(() => ({}), 'child')

baseOrm.put({
  id: 1,
  baseChild: {
    id: 1
  }
})
