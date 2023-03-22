import {ref} from "vue";

export default function dateAgo(date){
    let result = ref('')
    const currentDate = new Date();
    const dispatchDate = new Date(date);
    const minutes = parseInt((currentDate - dispatchDate.getTime()) / 60000 )
    const hour = parseInt(minutes / 60)
    const day = parseInt(hour / 24)
    if (minutes){
        result.value = minutes + ' мин. назад'
    }else {
        result.value = ' сейчас'
    }
    if (hour){
        result.value = hour + ' ч. назад'
    }
    if (day){
        result.value = day + ' д. назад'
    }
    return {result}
}
