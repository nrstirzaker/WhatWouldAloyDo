<script>

import { defineComponent } from 'vue'
import axios from 'axios';

export default defineComponent({

  data() {
    return {
      name: "",
      task: "",
      dateOfTask: ""
    }
  },
  methods:{
    async save(){
      console.log("here")
      const data = {
        "name" : this.name,
        "task" : this.task,
        "when" : this.when,
      }
      axios.post('http://localhost:3000/api/save',data
      )
      .then(function (response) {
        // handle success
        console.log("response:" + response);
      })
    },
    getTasksFrom : function(){
      
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
          Your name/handle
        </label>
      </div>
      <div class="md:w-2/3">
        <input id="inline-name" type="text" v-model="name" maxlength="50"
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-task">
          How you will '...heal the world a little bit'?
        </label>
      </div>
      <div class="md:w-2/3">
        <textarea id="inline-task" type="textarea" v-model="task" maxlength="500"
          class="h-64 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"></textarea>
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-date-of-task">
          When ..?
        </label>
      </div>
      <div class="md:w-2/3">
        <input id="inline-when" type="date" v-model="when"
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
      </div>

    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        &nbsp;
      </div>
      <div class="md:w-2/3">
        <div class="relative w-128 h-12">

          <button class="btn btn-blue absolute inset-y-0 left-0 w-24 h-12" @click.prevent="save">
            Save
          </button>


          <button class="btn btn-transparent absolute inset-y-0 right-0 w-24 h-12" >
            Reset
          </button>

        </div>

      </div>
    </div>

  </form>
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
