<script setup lang="ts">
import type { Message } from 'ollama';
import { computed } from 'vue';

interface Props {
  message: Message;
}

const props = defineProps<Props>();

const messageClass = computed(() => {
  return props.message.role === 'user' ? 'message userMessage' : 'message agentMessage';
});

const avatarClass = computed(() => {
  return props.message.role === 'user' ? 'userAvatar' : 'agentAvatar';
});

const avatarIconClass = computed(() => {
  return props.message.role === 'user' ? 'pi pi-user' : 'pi pi-desktop';
});
</script>

<template>
  <div :class="messageClass">
    <Avatar :class="avatarClass"><i :class="avatarIconClass" style="font-size: 1rem"></i></Avatar>
    <div class="messageContent">{{ props.message.content }}</div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
}

.messageContent {
  margin: 0 1rem;
  padding: 15px;
}
.userMessage {
  background-color: var(--primary-50);
}

.userAvatar {
  min-width: 2rem;
  background-color: var(--primary-200);
}

.agentMessage {
  background-color: var(--blue-50);
}

.agentAvatar {
  min-width: 2rem;
  background-color: var(--blue-200);
}
</style>