'use strict'

const isString = require('amp-is-string')
const q = require('q')
const uuid = require('node-uuid')
const IPCAdapterChannel = 'IPCAdapter'

module.exports = class IPCAdapter {
  constructor (send, on) {
    this.send = send
    this.topicHandlers = {}
    this.awaitingResponseHandlers = {}

    on(IPCAdapterChannel, (event, envelope) => {
      const topic = envelope.topic
      const id = envelope.id
      const payload = envelope.payload

      if (isString(topic) && topic.length > 0 && this.topicHandlers[topic] != null) {
        // Handle incoming request for topic:
        this.topicHandlers[topic](payload)
          .then((responsePayload) => {
            event.sender.send(IPCAdapterChannel, { id, payload: responsePayload })
          })
      } else if (isString(id) && id.length > 0 && this.awaitingResponseHandlers[id] != null) {
        // Handle a response we are waiting for:
        this.awaitingResponseHandlers[id].deferred.resolve(payload)
        delete this.awaitingResponseHandlers[id]
      }
    })
  }

  registerTopic (topic, handler) {
    this.topicHandlers[topic] = handler
  }

  ask (topic, payload, processResponsePayload) {
    const deferred = q.defer()
    const id = uuid.v4()
    const timestamp = new Date()

    if (processResponsePayload == null) {
      processResponsePayload = (payload) => payload
    }

    // If a function was given as payload simply assume that we should use that
    // function as processResponsePayload:
    if (typeof (payload) === 'function') {
      processResponsePayload = payload
    }

    this.awaitingResponseHandlers[id] = { deferred, id, timestamp }
    this.send(IPCAdapterChannel, { id, topic, payload })

    return deferred.promise
      .then((payload) => processResponsePayload(payload))
  }

  tell (topic, payload) {
    const id = uuid.v4()
    this.send(IPCAdapterChannel, { id, topic, payload })
    return q.when()
  }
}
