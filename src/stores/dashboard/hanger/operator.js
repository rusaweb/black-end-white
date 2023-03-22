import {ref} from "vue";
import axios from "axios";
import {defineStore} from "pinia";

export const useOperatorPackagerStore = defineStore('hanger-operator', () => {
    const loading = ref(false)
    const hanger = ref(null)
    const hangers = ref(null)

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_api.md#packager-get-hanger-by-id
    // Packager Get Hanger by ID

    const getHanger = async (id) => {
        loading.value = true
        try {
            hanger.value = (await axios.get('/api/v1/operator/packager/' + id)).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_api.md#packager-get-hanger-by-code
    // Packager Get Hanger by Code

    const getHangerByCode = async (code) => {
        loading.value = true
        try {
            hanger.value = (await axios.get('/api/v1/operator/packager/code/' + code)).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_api.md#packager-get-hangers-page
    // Packager Get Hangers Page

    const getHangers = async (args) => {
        loading.value = true
        try {
            hangers.value = (await axios.get('/api/v1/operator/packager/?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        getHanger,
        getHangerByCode,
        getHangers,
        loading,
        hanger,
        hangers,
    }
});
