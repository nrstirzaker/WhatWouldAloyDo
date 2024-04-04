import axios from 'axios';
import { DateTime } from 'luxon'

function reviewTask(id, ip_address){
    const params = {"id" : id, "ip_address" : ip_address}
    const promise = axios.post('/api/task/review',params )
        .then(response => {
            console.log(DateTime.utc().toISO() + " :logRemoveContent " + response.data.count + " tasks retrieved")
            return response.data.count 
        }).catch((error => {
            console.error(DateTime.utc().toISO() + "Error: " + error)
        }))

        return promise;

}

export default reviewTask