<script>

import { defineComponent } from 'vue'
import axios from 'axios';
import { DateTime } from 'luxon'
import TasksComponent from './TasksComponent.vue'


export default defineComponent({
  name:'HealTheWorldJustALIttleBit',
  components:{
    TasksComponent
  },
  data() {
    return {
      name: "",
      task: "",
      date_of_task: "",
      ip_address_author: "",
      errorMessage: "",
    }
  },
  mounted: async function () {
    this.setIPAddress()
    
  },
  setup() {
    const formatDate = ((date) => {
      console.log(DateTime.utc().toISO() + ":Date: " + date)
      const formattedDate = DateTime.fromISO(date).toFormat("ccc d MMMM y")
      const parts = formattedDate.split(" ")
      const dateWithOrdinal = getOrdinal(parts[1])
      return parts[0] + " " + dateWithOrdinal + " " + parts[2] + " " + parts[3]

    })

    function getOrdinal(number) {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const v = number % 100;
      return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }

    return { formatDate }
  },
  methods: {
    scrollFunction: function(){
      console.log(DateTime.utc().toISO() + ":Scrolling")
    },
    save: async function () {

      console.log(DateTime.utc().toISO() + ":Saving")
      console.log(DateTime.utc().toISO() + ":Saving:Author IP Address:" + this.ip_address_author)
      const data = {
        "name": this.name,
        "task": this.task,
        "date_of_task": this.date_of_task,
        "ip_address_author": this.ip_address_author,
      }
      axios.post('/api/save', data)
        .then(response => {
          console.log(DateTime.utc().toISO() + ":Success:" + response);
          this.name = ""
          this.task = ""
          this.date_of_task = ""
        })
        .catch((error) => {
          console.log(DateTime.utc().toISO() + ":Error:" + error);
        })

    },
    validateThenSave: async function () {

      if (!this.name || !this.task || !this.date_of_task) {
        this.errorMessage = "Please input all values"
        return
      }

      axios.get('/api/validate/?ip_address_author=' + this.ip_address_author)
        .then(response => {
          console.log(DateTime.utc().toISO() + " " + JSON.stringify(response.data));
          if (response.data.validToday) {
            console.log(DateTime.utc().toISO() + "IS valid Today");
            this.save()
          } else {
            console.log(DateTime.utc().toISO() + " NOT valid Today");
            this.errorMessage = "You can only post a task once per day"
          }
        })
        .catch((error => {
          console.error(DateTime.utc().toISO() + "Error: " + error)
        }))
    },
    setIPAddress: function () {
      axios.get('https://jsonip.com/').then(response => {
        this.ip_address_author = response.data.ip;
      })
    }

  }
})


</script>

<template>
  <div class="grid grid-cols-2 gap-10">
    <form class="w-full max-w-">

      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
            Your name/handle <span class='text-red-600'>*</span>
          </label>
        </div>
        <div class="md:w-2/3">
          <div class="text-red-600">{{ errorMessage }}</div>
          <input id="inline-name" type="text" v-model="name" maxlength="50"
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
        </div>
      </div>

      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-task">
            How you will '...heal the world a little bit'? <span class='text-red-600'>*</span>
          </label>
        </div>
        <div class="md:w-2/3">
          <textarea id="inline-task" type="textarea" v-model="task" maxlength="140"
            class="h-64 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"></textarea>
        </div>
      </div>

      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-date-of-task">
            When ..? <span class='text-red-600'>*</span>
          </label>
        </div>
        <div class="md:w-2/3">
          <input id="inline-when" type="date" v-model="date_of_task"
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
        </div>

      </div>

      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          &nbsp;
        </div>
        <div class="md:w-2/3">
          <div class="relative w-128 h-12">

            <button class="btn btn-blue absolute inset-y-0 left-0 w-24 h-12" @click.prevent="validateThenSave()">
              Save
            </button>


            <button class="btn btn-transparent absolute inset-y-0 right-0 w-24 h-12">
              Reset
            </button>

          </div>

        </div>
      </div>

    </form>
    <div>

        <TasksComponent />
      

    </div>
  </div>
</template>

<style scoped>
.btn {
  @apply font-bold py-2 px-4 rounded;
}

.btn-blue {
  @apply bg-blue-500 text-white;
}

.btn-blue:hover {
  @apply bg-blue-700;
}

.btn-transparent {
  @apply bg-transparent text-black border-blue-700;
}

.btn-transparent:hover {
  @apply bg-transparent;
}
</style>
