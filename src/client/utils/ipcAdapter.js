import q from 'q'

const ipcRenderer = window.require('electron').ipcRenderer

class IPCAdapter {
  constructor (ipcRenderer) {
    this.ipcRenderer = ipcRenderer
  }

  getHubs () {
    const deferred = q.defer()

    this.ipcRenderer.send('IPCAdapter', { topic: 'getHubs' })
    this.ipcRenderer.on('IPCAdapter', function (event, envelope) {
      if (envelope.topic === 'getHubs-reply' && Array.isArray(envelope.hubs)) {
        deferred.resolve(envelope.hubs)
      }
    })

    return deferred.promise
  }

  getActivities (hubUuid) {
    const deferred = q.defer()

    ipcRenderer.send('IPCAdapter', { topic: 'getActivities', hubUuid: hubUuid })
    ipcRenderer.on('IPCAdapter', function (event, envelope) {
      if (envelope.topic === 'getActivities-reply' && envelope.hubUuid && Array.isArray(envelope.activities)) {
        deferred.resolve(envelope.activities)
      }
    })

    return deferred.promise
  }

  startActivityForHub (activityId, hubUuid) {
    ipcRenderer.send('IPCAdapter', {
      topic: 'startActivityForHub',
      hubUuid: hubUuid,
      activityId: activityId
    })

    return q.when()
  }
}

const ipcAdapter = new IPCAdapter(ipcRenderer)
export default ipcAdapter
