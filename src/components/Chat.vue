<script setup lang="ts">
import { ref, toRefs } from 'vue'
import ollama from 'ollama'
import ChatMessage from '../components/ChatMessage.vue'
import { useModelStore } from '@/stores/model'
import { defineStore } from 'pinia'

const chatInput = ref('Why is the sky blue?')
const messages = ref([{ role: 'agent', content: 'Hello, I am Lliam. How can I help you?' }])
const currentOutputMessageContent = ref('')

const modelStore = useModelStore()
const { currentModel } = toRefs(modelStore)

const submitChat = async () => {
  console.log('submitting chat', chatInput.value)
  const content = chatInput.value
  const inputMessage = { role: 'user', content }
  messages.value.push(inputMessage)
  chatInput.value = ''

  console.log('Chatting with model: ', currentModel.value)
  const response = await ollama.chat({
    model: currentModel.value.split(':')[0],
    messages: [inputMessage]
    // stream: true
  })
  console.log(response.message.content)

  currentOutputMessageContent.value += await response.message.content

  messages.value.push({ role: 'agent', content: currentOutputMessageContent.value })
  currentOutputMessageContent.value = ''
}
</script>

<template>
  <div id="chatBox">
    <div id="chatContainer">
      <div id="chatArea" ref="chatArea">
        <div v-for="message in messages" :key="message.content">
          <ChatMessage :message="message" />
        </div>
        <div v-if="currentOutputMessageContent">
          <!-- {{ currentOutputMessageContent }} -->
          <ChatMessage :message="{ role: 'agent', content: currentOutputMessageContent }" />
        </div>
      </div>
    </div>
    <div id="inputArea">
      <Textarea id="chatInput" v-model="chatInput" @keyup.enter="submitChat" />
      <Button @click="submitChat" id="submitButton">Submit</Button>
    </div>
  </div>
</template>

<style scoped>
#chatBox {
  display: flex;
  height: 100%;
  flex-direction: column;
}

#chatContainer {
  position: relative;
  width: 100%;
  height: calc(100% - 100px);
}

#chatArea {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
}
#inputArea {
  display: flex;
  height: 100px;
  width: 100%;
  padding: 10px;
  align-items: space-between;
}

#chatInput {
  width: calc(100% - 82px);
  height: 100%;
  padding: 10px;
  margin-right: 10px;
}
</style>
