import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {confirm} from "@/utils/confirm";
import {useTemplateStore} from "@/stores/template";

export const useLeadsStore = defineStore('leads', () => {
    const loading = ref(false)
    const leads = ref(null)
    const lead = ref(null)
    const store = useTemplateStore()

    // Operator Create Lead
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/lead_api.md#operator-create-lead

    const createLead = async (data) => {
        try {
            await axios.post('/api/v1/lead/operator', data)
            await getLeads()
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // Operator Get Lead
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/lead_api.md#operator-get-lead

    const getLead = async (id) => {
        loading.value = true
        try {
            lead.value = (await axios.get('/api/v1/lead/operator/' + id)).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    // Operator Get Leads List
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/lead_api.md#operator-get-leads-list

    const getLeads = async (args) => {
        loading.value = true
        try {
            leads.value = (await axios.get('/api/v1/lead/operator/?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    // Operator Update Lead
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/lead_api.md#operator-update-lead

    const updateLead = async (data) => {
        try {
            await axios.put('/api/v1/lead/operator', data)
            await getLeads()
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // Operator Delete Lead
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/lead_api.md#operator-delete-lead

    const deleteLead = async (id, callback, modal) => {
        try {
            if (modal){
                confirm(async () => {
                    await axios.delete('/api/v1/lead/operator/' + id)
                    await getLeads()
                    await callback()
                    await store.openToast('success')
                })
            }else {
                await axios.delete('/api/v1/lead/operator/' + id)
                await getLeads()
                await callback()
                await store.openToast('success')
            }

        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // Operator Create Lead Call
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/lead_api.md#operator-create-lead-call

    const createLeadCall = async (data) => {
        try {
            await axios.post('/api/v1/lead/operator/' + data.id + '/call', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // Operator Delete Lead Call
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/lead_api.md#operator-delete-lead-call

    const deleteLeadCall = async ({id, callId}) => {
        try {
            await axios.delete('/api/v1/lead/operator/' + id + '/call/' + callId)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    return {
        createLead,
        getLead,
        getLeads,
        updateLead,
        deleteLead,
        createLeadCall,
        deleteLeadCall,
        leads,
        lead,
        loading
    }
})
