import axios from 'axios';
import { DateTime } from 'luxon'

function getTasks(direction,position){
    const directionParam = direction
    const positionParam = position

    const promise = axios.get('/api/tasks/' +  directionParam + "/" + positionParam, {
        responseType: 'json'
        })
        .then(response => {
            console.log(DateTime.utc().toISO() + " :getTasks(inner): " + response.data.tasks.length + " tasks retrieved")
            return response.data.tasks
        }).catch((error => {
            console.error(DateTime.utc().toISO() + "Error: " + error)
        }))

        return promise;

}

export default getTasks