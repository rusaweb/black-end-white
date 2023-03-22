import {ref} from "vue";
import axios from "axios";
import {defineStore} from "pinia";

export const useUserCourierStore = defineStore('user-courier', () => {
    const loading = ref(false)
    const user = ref(null)

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#administrator-get-users-list
    // Administrator Get Users List

    const getUser = async (id) => {
        loading.value = true
        try {
            user.value = (await axios.get('/api/v1/user/courier/by-order/' + id)).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        getUser,
        user,
        loading
    }
});
