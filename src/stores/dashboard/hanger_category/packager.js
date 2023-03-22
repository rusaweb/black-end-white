import {ref} from "vue";
import axios from "axios";
import {defineStore} from "pinia";

export const useHangerCategoryPackagerStore = defineStore('hanger-category-packager', () => {
    const loading = ref(false)
    const hanger_category = ref(null)
    const hanger_categories = ref(null)
    const url = '/api/v1/hanger-category/packager/'

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_category_api.md#administrator-get-hanger-category
    // Administrator Get Hanger Category

    const getHangerCategory = async (id) => {
        try {
            hanger_category.value = (await axios.get(url + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_category_api.md#administrator-get-hanger-categories-page
    // Administrator Get Hanger Categories Page

    const getHangerCategories = async (args) => {
        loading.value = true
        try {
            hanger_categories.value = (await axios.get(url + '?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        getHangerCategory,
        getHangerCategories,
        loading,
        hanger_category,
        hanger_categories
    }
});
