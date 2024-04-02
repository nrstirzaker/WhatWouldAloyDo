<script setup>
import { defineComponent, watch, reactive } from 'vue'

import TaskComponent from './TaskComponent.vue'
import { ref, onMounted, onUnmounted, toRefs } from 'vue'
import getTasks from './getTasks'
import { DateTime } from 'luxon'
import axios from 'axios';
import { useScroll, useInfiniteScroll } from '@vueuse/core'

const scrollComponent = ref(null);

const { x, y, isScrolling, arrivedState, directions } = useScroll(scrollComponent, { behavior: "auto" })
const { left, right, top, bottom } = toRefs(arrivedState)
const { left: toLeft, right: toRight, top: toTop, bottom: toBottom } = toRefs(directions)


const tasks = reactive(new Map())
const topPosition = ref(0)
const bottomPosition = ref(0)


function getMoreTasks(direction, position) {
    getTasks(direction, position).then(results => {

        if (results.length > 0) {

            console.log(DateTime.utc().toISO() + ":getTasks(outer):tasks.size: " + tasks.size)
            //console.log(DateTime.utc().toISO() + ":getTasks:result[0].position: " + results[0].position)
            //console.log(DateTime.utc().toISO() + ":getTasks:result[length-1].position: " + results[results.length - 1].position)

            results.forEach((task, index, arr) => {
                tasks.set(task.position, task)
            })

            if (bottom.value && tasks.size > 20) {
                console.log(DateTime.utc().toISO() + ":getTasks(outer):triggered deleting top data")    
                let toDeleteCount = 0;
                const copyOfKeys = [...tasks.keys()]
                for (const position of copyOfKeys) {

                    tasks.delete(position)
                    console.log(DateTime.utc().toISO() + ":getTasks(outer):deleting: " + position)
                    console.log(DateTime.utc().toISO() + ":getTasks(outer):toDeleteCount: " + toDeleteCount)
                    toDeleteCount++
                    if (toDeleteCount === 5) {
                        break;
                    }
                }
                console.log(DateTime.utc().toISO() + ":getTasks(outer):tasks.size (after delete): " + tasks.size)
                console.log(DateTime.utc().toISO() + ":getTasks(outer):Array.from(tasks)[0]: " + Array.from(tasks)[0].key)
                
            }
            
            topPosition.value = results[0].position
            bottomPosition.value = results[results.length - 1].position
        }

    })
}

onMounted(() => {
    getMoreTasks("forward", 0);
})


watch(bottom, () => {

    if (bottom.value) {
        getMoreTasks("forward", bottomPosition.value)
    }

})

watch(top, () => {

    if (top.value) {        
        getMoreTasks("backward", topPosition.value)
    }

})


</script>

<template>
    <div>
        <div class="scrolling-component h-96 overflow-y-scroll" ref="scrollComponent">
            <TaskComponent v-for="task in tasks.values()" :task="task" :key="task.id" />
        </div>
    </div>
</template>
<style scoped></style>