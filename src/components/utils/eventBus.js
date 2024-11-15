import Vue from 'vue'
const EventBus = new Vue()

function subscribeEvent(eventName, eventHandler) {
  EventBus.$on(eventName, eventHandler)
}

function unSubscribeEvent(eventName, eventHandler) {
  EventBus.$off(eventName, eventHandler)
}

function emitEvent(eventName, payload) {
  EventBus.$emit(eventName, payload)
}

export const EVENT = {
  subscribeEvent,
  unSubscribeEvent,
  emitEvent,
}

export const EVENTS = {
  LIVELINESS: 'verifyLivelinessStatusEvent',
  IDDOCOCR: 'verifyIdDocStatusEvent',
}
