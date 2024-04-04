<template>

    <div class="max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="text-sm">{{ task.name }} {{ this.formatDate(task.date_of_task) }}</div>
        <br />
        <p class="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400 text-left">{{ task.task }}</p>
        <a href="#" @click.prevent="remove"
            class="inline-flex items-start px-3 py-2 text-sm font-normal text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Remove
        </a>
    </div>
</template>

<script>

import { DateTime } from 'luxon'


export default {
    name: 'TaskComponent',
    props: {
        task: Object
    },
    setup(props) {

        const formatDate = (date) => {
            if (date) {
                const formattedDate = DateTime.fromISO(date).toFormat("ccc d MMMM y")
                const parts = formattedDate.split(" ")
                const dateWithOrdinal = getOrdinal(parts[1])
                return parts[0] + " " + dateWithOrdinal + " " + parts[2] + " " + parts[3]
            }

        }

        function getOrdinal(number) {
            const suffixes = ['th', 'st', 'nd', 'rd'];
            const v = number % 100;
            return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
        }

        function remove(){

        }

        return { formatDate, remove }
    }
}

</script>

<style scoped></style>