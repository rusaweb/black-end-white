import { defineStore } from "pinia";

export const useYMapStore = defineStore({
    id: "yMap",
    state: () => ({
        yMap: null,
    }),
    actions: {
        setYMap(payload) {
            this.yMap = payload
        },
    },
});
