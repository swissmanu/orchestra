import ipcAdapter from '../utils/ipcAdapter'

export const EXECUTE_CONTROL_ACTION = 'EXECUTE_CONTROL_ACTION'

export function executeControlAction (action, hubUuid) {
  ipcAdapter.executeControlAction(action, hubUuid)

  return {
    type: EXECUTE_CONTROL_ACTION,
    action,
    hubUuid
  }
}
