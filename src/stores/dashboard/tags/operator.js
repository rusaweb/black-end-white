import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import {confirm} from "@/utils/confirm";
import {useTemplateStore} from "@/stores/template";

export const useTagsStore = defineStore('tags-operator', () => {
    const loading = ref(false)
    const tag = ref(null)
    const tags_color = ref(null)
    const tags_sex = ref(null)
    const tags_defects = ref(null)
    const url = '/api/v1/order-item-tag-suggestion/operator/'
    const store = useTemplateStore()

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_tag_suggestion_api.md#operator-create-suggestion
    // Operator Create Suggestion

    const createTag = async (data) => {
        try {
            await axios.post(url, data)
            store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_tag_suggestion_api.md#operator-update-suggestion
    // Operator Update Suggestion

    const updateTag = async (data) => {
        try {
            await axios.put(url + data.id, data)
            store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }


    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_tag_suggestion_api.md#operator-get-suggestion-by-id
    // Operator Get Suggestion by ID

    const getTag = async (id) => {
        try {
            tag.value = (await axios.get(url + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }


    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_tag_suggestion_api.md#operator-get-suggestions-list
    // Operator Get Suggestions List

    const getTagsColor = async (args) => {
        loading.value = true
        try {
            tags_color.value = (await axios.get(url + '?code=color&' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_tag_suggestion_api.md#operator-get-suggestions-list
    // Operator Get Suggestions List

    const getTagsSex = async (args) => {
        loading.value = true
        try {
            tags_sex.value = (await axios.get(url + '?code=sex&' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_tag_suggestion_api.md#operator-get-suggestions-list
    // Operator Get Suggestions List

    const getTagsDefects = async (args) => {
        loading.value = true
        try {
            tags_defects.value = (await axios.get(url + '?code=defects&' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_tag_suggestion_api.md#operator-delete-suggestion
    // Operator Delete Suggestion

    const deleteTag = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete(url + id)
                await callback()
            })
        } catch (err) {
            throw new Error(err)
        }
    }

    return {
        getTag,
        createTag,
        updateTag,
        getTagsColor,
        getTagsSex,
        getTagsDefects,
        deleteTag,
        tag,
        tags_defects,
        tags_color,
        tags_sex,
        loading,
    }
})
