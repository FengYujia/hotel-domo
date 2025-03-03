import axios from 'axios';
import formatter from './core/formatter';
import paramsFormatter from './core/params-formatter';


export default {
    list: async function (commit = {}) {
        const query = paramsFormatter(commit);
        const resp = await axios.get('/api/reservation/list?' + query);
        return formatter(resp.data);
    },
    create: async function (commit = {}) {
        const resp = await axios.post('/api/reservation/create', commit);
        return formatter(resp.data);
    },
    update: async function (commit = {}) {
        const resp = await axios.post('/api/reservation/update', commit);
        return formatter(resp.data);
    },
    cancel: async function (commit = {}) {
        const resp = await axios.post('/api/reservation/cancel', commit);
        return formatter(resp.data);
    },

};
