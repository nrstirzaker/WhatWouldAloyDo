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


let tasks = reactive(new Map())
const topPosition = ref(0)
const bottomPosition = ref(0)


function getMoreTasks(direction, position) {
    getTasks(direction, position).then(results => {

        if (results.length > 0) {

            
            //console.log(DateTime.utc().toISO() + ":getTasks:result[0].position: " + results[0].position)
            //console.log(DateTime.utc().toISO() + ":getTasks:result[length-1].position: " + results[results.length - 1].position)
            console.log(DateTime.utc().toISO() + ":getTasks(outer):tasks.size:pre load " + tasks.size)
            results.forEach((task, index, arr) => {
                tasks.set(task.position, task)                
                console.log(DateTime.utc().toISO() + ":getTasks(outer):forEach:position " + task.position)
            })
            tasks = reactive(new Map([...tasks.entries()].sort()));

            console.log(DateTime.utc().toISO() + ":getTasks(outer):tasks.size:post load " + tasks.size)

            if (bottom.value && tasks.size > 20) {
                console.log(DateTime.utc().toISO() + ":getTasks(outer):triggered deleting top data")    
                let toDeleteCount = 0;
                const copyOfKeys = [...tasks.keys()]
                for (const position of copyOfKeys) {

                    tasks.delete(position)
                    console.log(DateTime.utc().toISO() + ":getTasks(outer):deleting: " + position)
                    toDeleteCount++
                    if (toDeleteCount === 10) {
                        break;
                    }
                }
                console.log(DateTime.utc().toISO() + ":getTasks(outer):tasks.size (post delete): " + tasks.size)
 
            }

            if (top.value && tasks.size > 20) {
                console.log(DateTime.utc().toISO() + ":getTasks(outer):triggered deleting top data")    
                let toDeleteCount = 0;
                const copyOfKeys = [...tasks.keys()].reverse()
                for (const position of copyOfKeys) {

                    tasks.delete(position)
                    console.log(DateTime.utc().toISO() + ":getTasks(outer):deleting: " + position)
                    toDeleteCount++
                    if (toDeleteCount === 10) {
                        break;
                    }
                }
                console.log(DateTime.utc().toISO() + ":getTasks(outer):tasks.size (post delete): " + tasks.size)
 
                
            }
            
            topPosition.value = Object.values(Array.from(tasks)[0])[0]
            bottomPosition.value = Object.values(Array.from(tasks)[tasks.size -1])[0]

            console.log(DateTime.utc().toISO() + ":getTasks(outer):topPosition.value: " + topPosition.value)
            console.log(DateTime.utc().toISO() + ":getTasks(outer):bottomPosition.value: " + bottomPosition.value)
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