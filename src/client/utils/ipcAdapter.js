import q from 'q'
import uuid from 'node-uuid'
import ACTIVITIY_STATUS from './activityStatus'

const ipcRenderer = window.require('electron').ipcRenderer

class IPCAdapter {
  constructor (ipcRenderer) {
    this.ipcRenderer = ipcRenderer
    this.awaitingResponseHandlers = {}

    ipcRenderer.on('IPCAdapter', (event, envelope) => {
      const { id, payload } = envelope
      const awaitingResponseHandler = this.awaitingResponseHandlers[id]

      if (awaitingResponseHandler !== undefined) {
        awaitingResponseHandler.deferred.resolve(payload)
        delete this.awaitingResponseHandlers[id]
      }
    })
  }

  ask (topic, payload, processResponsePayload = (payload) => payload) {
    const deferred = q.defer()
    const id = uuid.v4()
    const timestamp = new Date()

    // If a function was given as payload simply assume that we should use that
    // function as processResponsePayload:
    if (typeof (payload) === 'function') {
      processResponsePayload = payload
    }

    this.awaitingResponseHandlers[id] = { deferred, id, timestamp }
    this.ipcRenderer.send('IPCAdapter', { id, topic, payload })

    return deferred.promise
      .then((payload) => processResponsePayload(payload))
  }

  tell (topic, payload) {
    const id = uuid.v4()
    this.ipcRenderer.send('IPCAdapter', { id, topic, payload })
    return q.when()
  }

  getHubs () {
    return this.ask('getHubs', (reply) => reply.hubs)
  }

  getActivities (hubUuid) {
    return q.all([
      this.ask('getActivities', { hubUuid }, (payload) => payload.activities),
      this.ask('getCurrentActivityForHub', { hubUuid }, (payload) => payload.activityId)
    ])
      .then((results) => {
        const activities = results[0]
        const currentActivityId = results[1]

        return activities.map((activity) => {
          if (activity.id === currentActivityId) {
            activity.activityStatus = ACTIVITIY_STATUS.STARTED
          } else {
            activity.activityStatus = ACTIVITIY_STATUS.OFF
          }

          return activity
        })
      })
  }

  startActivityForHub (activityId, hubUuid) {
    return this.tell('startActivityForHub', { hubUuid, activityId })
  }
}

const ipcAdapter = new IPCAdapter(ipcRenderer)
export default ipcAdapter
