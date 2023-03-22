import Swal from "sweetalert2";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let toast = Swal.mixin({
    buttonsStyling: false,
    target: "#page-container",
    showCancelButton: true,
    customClass: {
        title: "text-secondary",
        confirmButton: "btn btn-sm btn-danger m-1",
        cancelButton: "btn btn-sm btn-secondary m-1",
        input: "form-control",
    },
});
export const confirm = (callback, options) => {
    toast.fire({
        title: options?.title || "Вы уверены?",
        text: options?.text || "При удалении данные не получится вернуть",
        confirmButtonText: options?.confirmButtonText || "Да удалить",
        cancelButtonText: options?.cancelButtonText || "Отмена",
        html: false,
        preConfirm: () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 50);
            });
        },
    }).then(async (result) => {
        if (result.value) {
            callback()
        }
    });
}
export const confirmRobot = (callback, options) => {
    const randomNum1 = getRandomInt(50)
    const randomNum2 = getRandomInt(50)
    const resultMath = randomNum1 + randomNum2
    toast.fire({
        title: options?.title || "Для того чтобы продожить решите пример",
        confirmButtonText: options?.confirmButtonText || "Да удалить",
        cancelButtonText: options?.cancelButtonText || "Отмена",
        customClass: {
            title: "text-secondary",
            confirmButton: "btn btn-sm btn-success m-1",
            cancelButton: "btn btn-sm btn-secondary m-1",
            input: "form-control",
        },
        html: `
                Чему будет равен <b>${randomNum1} + ${randomNum2} = ?</b>
                <input type="number" id="result" class="form-control w-100 mt-2" placeholder="Впишите ответ" />
            `,
        preConfirm: () => {
            return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 50);
            });
        },
    }).then(async (result) => {
        if (result.value) {
            if (parseInt(document.getElementById('result').value) === resultMath){
                callback()
            }else {
                await toast.fire({title: 'Вы ответили не верно', cancelButtonText: "Попробую еще раз",})
            }
        }
    });
}

