import {ref} from "vue";
import axios from "axios";
import {defineStore} from "pinia";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";
import router from "@/router";

export const useConsumptionStore = defineStore('consumption', () => {
    const loading = ref(false)
    const consumptions = ref(null)
    const consumption = ref(null)
    const store = useTemplateStore()
    const create = async (data) => {
        loading.value = true
        try {
            await axios.post('/api/v1/consumption/administrator', data)
            store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    const getConsumptions = async (args) => {
        loading.value = true
        try {
            consumptions.value = (await axios.get('/api/v1/consumption/administrator?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }
    const getConsumption = async (id) => {
        loading.value = true
        try {
            consumption.value = (await axios.get('/api/v1/consumption/administrator/' + id)).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }
    const deleteConsumption = async (id) => {
        loading.value = true
        try {
            confirm(async () => {
                await axios.delete('/api/v1/consumption/administrator/' + id)
                await getConsumptions(router.currentRoute.value.query)
            })
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }



    return {
        getConsumptions,
        getConsumption,
        deleteConsumption,
        create,
        consumptions,
        consumption,
        loading,
    }
});
