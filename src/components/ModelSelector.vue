<script setup lang="ts">
import { onMounted, computed, ref, toRefs } from 'vue'
import ollama, { type ListResponse } from 'ollama'
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query'
import { useModelStore } from '@/stores/model'
import PullModelDialog from '../components/PullModelDialog.vue'

const modelStore = useModelStore()
const { currentModel } = toRefs(modelStore)
const getModels = async () => {
  const response = await ollama.list()
  const mostRecentModel = response.models.reduce((a, b) => (a.modified_at > b.modified_at ? a : b))
  modelStore.setCurrentModel(mostRecentModel.name)
  return response
}

const { isPending, isError, data, error } = useQuery({
  queryKey: ['models'],
  queryFn: getModels
})

const loadingModelName = ref('')
const progressStatus = ref('')
const progressCompleted = ref(0)
const progressTotal = ref(0)
const progressPercent = computed(() => {
  return Math.floor((progressCompleted.value / progressTotal.value) * 100)
})

const pullModelWithProgress = async (model: string) => {
  loadingModelName.value = model
  const pullProgress = await ollama.pull({ model, stream: true })
  for await (const part of pullProgress) {
    progressStatus.value = part.status
    progressCompleted.value = part.completed || 0
    progressTotal.value = part.total || 100
    console.log(part)
  }
  loadingModelName.value = ''
}

// const dialogVisible = ref(false)
// const loadingModel = ref(false)
// const pullModel = async (model: string) => {
//   dialogVisible.value = false
//   loadingModel.value = true
//   await ollama.pull({ model })
//   loadingModel.value = false
// }

const queryClient = useQueryClient()
const pullModelMutation = useMutation({
  mutationFn: pullModelWithProgress,
  onSuccess(data, variables, context) {
    queryClient.invalidateQueries({ queryKey: ['models'] })
  }
})
const dialogVisible = ref(false)
const pullModel = (name: string) => {
  pullModelMutation.mutate(name)
  dialogVisible.value = false
}

const data1 = ref<ListResponse | null>(null)

onMounted(async () => {
  try {
    const response = await getModels()
    data.value = response
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div id="modelSelectorContainer">
    <div id="modelSelector" class="flex flex-column h-10rem">
      <span class="text-lg font-bold">Model</span>
      <div v-if="!data">
        <Dropdown placeholder="Loading Models..." loading class="w-full md:w-14rem"></Dropdown>
      </div>
      <div v-else-if="data" class="flex">
        <Dropdown
          v-model="currentModel"
          :options="data.models"
          optionLabel="name"
          optionValue="model"
          placeholder="Select a Model"
          class="w-full md:w-14rem"
        />
        <Button
          icon="pi pi-plus"
          aria-label="Add Model"
          class="ml-2"
          @click="dialogVisible = true"
        />
        <ProgressBar v-if="loadingModel" mode="indeterminate" style="height: 6px"></ProgressBar>
        <PullModelDialog
          :visible="dialogVisible"
          @create="pullModel"
          @cancel="dialogVisible = false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
#modelSelectorContainer {
  display: flex;
}

#modelSelector {
  width: 100%;
  margin: 1rem;
}
</style>
