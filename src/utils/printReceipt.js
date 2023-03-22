export function printReceipt(data) {
    const {
        order_id,
        items,
        order_items,
        profile,
        created,
        delivery,
        accessories,
        additional_services,
        immediate_order_additional_percent,
        paid_amount,
        remaining_amount,
        current_tariff,
        discount,
        user
    } = data
    console.log(data)
    const from_customer_to_department_length = delivery.issues.filter(e=> (e.address.type === 'address_line' && e.type === 'FROM_CUSTOMER_TO_DEPARTMENT')).length
    const from_department_to_customer_length = delivery.issues.filter(e=> (e.address.type === 'address_line' && e.type === 'FROM_DEPARTMENT_TO_CUSTOMER')).length
    const from_department_to_customer_extra_length = delivery.issues.filter(e=> (e.address.type === 'address_line' && e.type === 'FROM_DEPARTMENT_TO_CUSTOMER_EXTRA')).length
    const from_customer_to_department_price = from_customer_to_department_length * delivery.from_client_delivery_price.amount
    const from_department_to_customer_price = from_department_to_customer_length * delivery.to_client_delivery_price.amount
    const from_department_to_customer_extra_price = from_department_to_customer_extra_length * delivery.to_client_delivery_price.amount
    const total_length = order_items.length
    const total_items_amount = items.map(e => e.total_amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    // const total_items_amount_with_discount = parseInt(total_items_amount - total_items_amount * (((user.status?.order_total_amount_discount_percent || 0) + (discount.promo_code_discount_percent || 0)) / 100)).toLocaleString('Ru-ru')
    
    const itemsHtml = order_items.map((e, key) => {
        const additional_services_html = e.additional_services.map((service, index) => {
               return `
            <tr style="border: 1px solid #000;">
                <td style="border-top: 1px solid #000; border-bottom: 1px solid #000;">${key + 1}.${index + 1}) Доп. обработка: ${service.name}</td>
                <td style="border: 1px solid #000; text-align: center; background-color: #E6E7E9;">  </td>
                ${service.price.type === "fixed_price" ? 
                `<td style="border-top: 1px solid #000; border-bottom: 1px solid #000; text-align: center; background-color: #E6E7E9;">${parseInt(service.price.amount).toLocaleString('Ru-ru')} сум</td>`: 
                   `<td style="border-top: 1px solid #000; border-bottom: 1px solid #000; text-align: center; background-color: #E6E7E9;">${parseInt((+e?.type?.price.amount / 100) * service.price.percent).toLocaleString('ru-RU')} сум</td>`
               }
            </tr>
           `
           })

        return `
             <tr style="border: 0 solid #000;">
                <td style="
                    border: 0 solid #000;
                    line-height: 1.2;
                    text-align: center;
                    font-weight: bold;
                    padding: 5px;
                    font-size: 10px;
                " colspan="3">${ items.at(key)?.type.category?.parent_category?.name?.toUpperCase() }</td>
             </tr>
             <tr>
              <td style="border: 1px solid #000; font-weight: normal; text-align:left; background-color: #E6E7E9; width: 600px;">Наименование</td>
              <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 50px;">Кол-во</td>
              <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 150px;">Сумма</td> 
            </tr>
            <tr style="border: 1px solid #000;">
                <td style="border: 1px solid #000;">${key + 1}) ${e.name} (${items.at(key)?.type.category?.name}) / ${e.tags?.filter(e => e.name === 'sex').map(e => e.value).join(' / ')} / ${e.tags?.filter(e => e.name === 'color').map(e => e.value).join(' / ')}</td>
                <td style="border: 1px solid #000; text-align: center; background-color: #E6E7E9;"> 1 </td>
                   ${items.at(key).price_percent_multiplier > 0 ? `<td style="border: 1px solid #000; background-color: #E6E7E9; text-align: center;" colspan="2"><span style="font-weight:bold;">
                     ${parseInt(items.at(key)?.price?.amount + ((items.at(key)?.price?.amount / 100) * items.at(key).price_percent_multiplier)).toLocaleString('Ru-ru')} сум</span>
                     </td>` : `<td style="border: 1px solid #000; background-color: #E6E7E9; text-align: center;" colspan="2"><span style="font-weight:bold;">
                     ${parseInt(items.at(key)?.price?.amount).toLocaleString('Ru-ru')} сум</span>
                     </td>`}
            </tr>
            ${additional_services_html.join('')}
            <tr style="border: 1px solid #000;">
                <td style="border: 1px solid #000;" colspan="${items.at(key).price_percent_multiplier ? 2 : 3}">
                Описание: ${e.description} | Описание дефектов: ${e.tags?.filter(e => e.name === 'defects').map(e => e.value).join(' / ')}
                </td>
                ${items.at(key).price_percent_multiplier ? 
                `<td style="border: 1px solid #000; background-color: #E6E7E9; text-align: center;" colspan="2">
                    <span style="font-weight:bold;"></span>
                 </td>` : ''}
            </tr>
        `
    })
    const accessoriesHtml = accessories.map((e) => {
        return `
            <tr style="border: 1px solid #000;">
                <td style="border: 1px solid #000; width: 600px;">${e.name}</td>
                <td style="border: 1px solid #000; text-align: center; background-color: #E6E7E9;width: 50px;"> ${e.count} </td>
                <td style="border: 1px solid #000; text-align: center; background-color: #E6E7E9;width: 150px;">${parseInt(e.total_amount).toLocaleString('Ru-ru')} сум</td>
            </tr>
        `
    })
    const additionalServicesHtml = additional_services.map((e) => {
        return `
            <tr style="border: 1px solid #000;">
                <td style="border: 1px solid #000;">${e.name}</td>
                <td style="border: 1px solid #000; text-align: center; background-color: #E6E7E9;width: 150px;">${parseInt(e.price.amount).toLocaleString('Ru-ru')} сум</td>
            </tr>
        `
    })
    const myWindow = window.open('', '', '')
    const html = `
        <!DOCTYPE html>
<html lang="en" style="background-color: #000;">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    @media print {
        body {-webkit-print-color-adjust: exact;}
        th {
            background-color: #E6E7E9 !important;
            print-color-adjust: exact; 
        }
        .header-left-top, .a-right-bottom, .time-right-bottom {
            display: none;
        }
        h1, div#header, div#sidebar, div#footer { display: none; }
    }
    .info-table th,
    .info-table td{
        padding: 0 10px;
    }
    </style>
</head>

<body
    style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; line-height: 1.5; width: 1123px; height: 1080px; background: #fff; margin: 0 auto; padding: 20px; display: flex; flex-direction: column;">
    <div style="display: flex; height: 100%;">
        <div style="margin-right: 10px;width: 50%; display: flex; flex-direction: column;">
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <td style="width: 33.33%; vertical-align: top;">
                            <span style="margin-bottom: 0; font-size: 22px; line-height: 0.5; display:block; margin-top: 20px;">№ ${order_id} <br> <span style="font-size: 14px;">${immediate_order_additional_percent ? 'срочный' : 'не срочный'}</span></span>
                        </td>
                        <td style="width: 33.33%; vertical-align: top; text-align: center;">
                            <svg style="width: 100px; height: 44px;" xmlns="http://www.w3.org/2000/svg" width="661"
                                height="263" viewBox="0 0 661 263" fill="none">
                                <path
                                    d="M0.00180214 199.749V138.829C0.00180214 127.304 4.94205 119.306 14.1174 113.191C19.9993 109.193 27.0568 107.546 34.3495 107.076L322.779 86.3771V64.9726C322.779 64.267 322.544 63.5614 322.073 62.8558C321.367 61.4446 320.19 60.5038 318.779 59.7982C318.308 59.7982 318.073 59.563 317.603 59.3278C313.368 56.7406 309.604 54.1534 306.31 50.1543C301.84 44.7447 300.194 38.1585 300.428 31.1024C300.428 29.2208 300.664 27.5744 301.134 25.6928C302.546 18.1664 306.545 11.5802 312.191 6.87614C317.837 2.17152 325.131 -0.415689 332.424 0.054713C334.07 0.054713 335.717 0.289912 337.364 0.525113C344.657 2.17152 350.774 6.16994 355.008 12.2858C359.243 18.6362 361.125 26.3984 360.89 33.9249C360.89 38.1585 357.361 41.2167 353.597 41.2167C349.597 40.9815 346.539 37.4535 346.539 33.2193C346.774 28.9856 345.833 24.7514 343.48 21.2234C341.363 18.1658 338.305 16.049 334.54 15.3434C333.599 15.1082 332.893 15.1082 331.952 15.1082C327.953 14.873 324.189 16.049 321.13 18.6362C318.072 21.2234 315.954 24.7514 315.014 28.7504C315.014 29.6912 314.779 30.632 314.779 31.5728C314.543 35.3361 315.955 38.3937 318.307 41.2167C320.189 43.3335 322.542 44.7447 324.895 46.1559V46.3911C329.6 48.5079 333.365 52.2711 335.482 57.4462C336.188 59.3278 336.893 61.6798 337.129 63.5614V63.7966V64.267V64.5022V82.8485V86.3765H336.423L624.852 107.075C632.145 107.546 639.203 109.192 645.084 113.191C654.26 119.306 659.2 127.303 659.2 138.829V151.06H633.086V162.585H656.612V174.581H633.086V187.283H660.611V199.749H617.323V138.829H645.79C645.79 128.95 634.497 121.189 625.322 120.953C526.748 112.72 428.174 108.251 329.6 99.5484C231.026 108.251 132.452 112.72 33.8778 120.953C24.7025 121.188 13.4105 128.95 13.4105 138.829H27.0556C32.7016 138.829 37.4072 140.241 41.1712 143.298C44.6999 146.592 46.5819 150.355 46.5819 155.294C46.5819 158.116 45.8762 160.704 44.6999 162.821C43.2884 164.938 41.6417 166.584 39.2886 167.76C42.3468 169.171 44.4641 171.053 46.1114 173.64C47.7582 175.992 48.6992 179.051 48.6992 182.343C48.6992 187.518 46.8172 191.517 42.8173 194.81C39.0533 198.103 34.3477 199.749 28.2312 199.749H0H0.00180214ZM584.624 235.501C586.506 235.501 588.152 236.912 588.152 239.029C588.152 240.911 586.506 242.557 584.624 242.557C582.506 242.557 580.86 240.911 580.86 239.029C580.86 236.912 582.506 235.501 584.624 235.501ZM73.6381 235.501C75.7554 235.501 77.4021 236.912 77.4021 239.029C77.4021 240.911 75.7554 242.557 73.6381 242.557C71.7561 242.557 70.1094 240.911 70.1094 239.029C70.1094 236.912 71.7561 235.501 73.6381 235.501ZM121.866 239.5C121.866 241.381 121.396 243.263 120.925 244.909C120.219 247.732 118.573 249.848 116.455 251.495C113.632 253.612 110.104 254.788 105.163 254.788H96.458V223.741H105.163C109.633 223.741 113.162 224.681 115.75 226.563C118.102 227.974 119.514 230.091 120.69 232.679C121.396 234.796 121.866 236.912 121.866 239.5ZM115.985 239.5C115.985 235.266 114.573 232.208 111.515 230.797C109.868 229.856 107.751 229.385 104.928 229.385H102.34V249.143H105.163C107.986 249.143 110.103 248.673 111.75 247.732C114.573 246.321 115.985 243.499 115.985 239.5ZM148.451 243.263V243.733C148.451 244.439 148.451 244.909 148.451 245.615H130.335C130.57 247.026 131.276 248.203 132.452 248.908C133.629 249.849 134.805 250.084 136.216 250.084C137.393 250.084 138.334 250.084 139.039 249.614C139.98 249.379 140.921 248.673 141.627 247.967H147.744C146.803 250.555 145.157 252.201 143.275 253.612C141.157 254.788 139.04 255.494 136.452 255.494C132.688 255.494 129.629 254.083 127.277 251.26C125.395 248.908 124.219 246.321 124.219 243.263C124.219 240.206 125.395 237.619 127.277 235.031C129.629 232.208 132.688 230.797 136.687 230.797C140.216 230.797 143.039 231.973 145.157 234.325C147.509 236.677 148.451 239.735 148.451 243.263V243.263ZM142.805 240.675C142.334 239.264 141.628 238.088 140.452 237.382C139.276 236.441 138.1 236.206 136.688 236.206C135.041 236.206 133.865 236.441 132.689 237.382C131.513 238.088 130.572 239.264 130.101 240.675H142.805H142.805ZM157.626 254.788H151.98V223.74H157.626V254.788ZM182.799 254.788H177.623V252.671C176.682 253.612 175.506 254.552 174.329 255.023C173.388 255.258 172.447 255.493 171.506 255.493C167.742 255.493 165.155 254.082 163.507 251.26C162.566 249.378 162.096 247.026 162.096 244.203V231.502H167.742V243.262C167.742 245.379 167.977 246.79 168.448 247.731C169.153 249.377 170.33 250.319 172.447 250.319C174.329 250.319 175.741 249.378 176.447 247.731C176.917 246.79 177.152 245.144 177.152 243.262V231.502H182.798V254.788H182.799ZM208.207 254.788H201.385L196.679 247.261L191.974 254.788H185.152L192.916 242.792L185.858 231.502H192.21L196.679 238.558L201.149 231.502H207.501L200.208 242.792L208.207 254.788H208.207ZM233.851 243.262V243.733C233.851 244.438 233.851 244.909 233.851 245.614H215.735C215.97 247.025 216.676 248.202 217.852 248.908C219.029 249.848 220.205 250.084 221.616 250.084C222.793 250.084 223.498 250.084 224.439 249.613C225.38 249.378 226.321 248.672 227.027 247.967H233.144C232.203 250.554 230.556 252.2 228.675 253.612C226.557 254.788 224.44 255.493 221.852 255.493C218.088 255.493 215.029 254.082 212.677 251.26C210.56 248.908 209.619 246.32 209.619 243.263C209.619 240.205 210.56 237.618 212.677 235.03C215.029 232.208 218.088 230.797 222.087 230.797C225.616 230.797 228.439 231.973 230.557 234.325C232.909 236.677 233.851 239.735 233.851 243.263V243.262ZM228.205 240.674C227.734 239.263 227.028 238.087 225.852 237.382C224.676 236.441 223.5 236.206 222.088 236.206C220.441 236.206 219.265 236.441 218.089 237.382C216.913 238.087 215.972 239.263 215.501 240.674H228.205H228.205ZM263.023 254.787H247.731V223.739H253.613V249.142H263.023V254.787ZM288.666 254.787H283.726V251.494C282.785 252.905 281.609 253.846 280.197 254.552C278.786 255.022 277.374 255.493 275.728 255.493C272.669 255.493 270.082 254.317 267.964 252.2C265.611 249.848 264.435 247.025 264.435 243.262C264.435 239.734 265.611 236.675 267.729 234.323C270.082 231.971 272.669 230.795 275.963 230.795C279.257 230.795 281.845 232.207 283.491 234.794L283.727 231.501H288.667V254.787H288.666ZM283.491 243.026C283.491 241.145 282.785 239.498 281.609 238.087C280.433 236.676 278.786 236.206 276.904 236.206C274.787 236.206 273.14 236.911 271.964 238.087C270.552 239.498 270.081 241.145 270.081 243.262C270.081 245.379 270.552 247.025 271.964 248.201C273.14 249.613 274.787 250.083 276.904 250.083C278.786 250.083 280.433 249.613 281.609 248.201C282.785 247.025 283.491 245.144 283.491 243.026ZM313.839 254.787H308.664V252.67C307.723 253.611 306.782 254.552 305.37 255.022C304.429 255.257 303.723 255.493 302.547 255.493C298.783 255.493 296.195 254.081 294.783 251.259C293.842 249.377 293.371 247.025 293.371 244.202V231.501H298.783V243.262C298.783 245.378 299.018 246.79 299.488 247.73C300.194 249.377 301.606 250.318 303.488 250.318C305.605 250.318 306.781 249.377 307.487 247.73C307.958 246.79 308.193 245.143 308.193 243.262V231.501H313.839V254.787H313.839ZM339.012 254.787H333.366V242.556C333.366 240.204 332.896 238.322 331.955 237.381C331.014 236.44 330.073 235.97 328.661 235.97C326.779 235.97 325.367 236.911 324.661 238.557C324.191 239.498 323.956 240.674 323.956 242.556V254.787H318.31V231.501H323.486V233.618C324.192 232.912 324.897 232.442 325.603 231.971C326.779 231.266 328.191 230.795 329.838 230.795C332.661 230.795 334.778 231.736 336.425 233.618C338.071 235.499 339.012 238.087 339.012 241.145V254.787ZM366.538 254.787H361.598V251.494C360.657 252.67 359.48 253.611 358.539 254.317C357.128 255.022 355.481 255.493 353.834 255.493C350.54 255.493 347.952 254.317 345.6 251.965C343.483 249.613 342.306 246.79 342.306 243.262C342.306 239.734 343.483 236.676 345.6 234.324C347.952 231.972 350.775 230.796 353.834 230.796C355.481 230.796 356.657 231.031 357.834 231.502C359.01 232.207 359.951 232.913 360.892 233.854L361.127 223.739H366.538V254.787H366.538ZM361.362 243.262C361.362 241.145 360.656 239.498 359.48 238.087C358.068 236.675 356.421 236.205 354.539 236.205C352.657 236.205 351.011 236.675 349.834 238.087C348.422 239.263 347.952 241.144 347.952 243.262C347.952 245.143 348.422 246.79 349.834 248.201C351.01 249.612 352.657 250.082 354.539 250.082C356.657 250.082 358.068 249.612 359.48 248.201C360.656 246.79 361.362 245.143 361.362 243.262ZM381.594 236.206C379.947 236.206 378.771 236.676 377.83 237.617C377.124 238.793 376.654 240.204 376.654 242.321V254.787H371.008V231.501H376.184V233.618C377.36 231.736 379.007 230.795 381.124 230.795C381.359 230.795 381.594 230.795 381.594 230.795V236.206H381.594ZM406.061 231.501L392.651 262.549H386.769L391.004 252.67L382.534 231.5H388.886L394.062 246.319L399.708 231.5H406.06L406.061 231.501ZM436.88 245.614C436.88 248.436 435.939 250.789 434.057 252.67C432.175 254.552 429.822 255.493 426.764 255.493C424.176 255.493 422.059 254.787 420.177 253.141C418.059 251.259 416.883 248.907 416.883 246.084H422.764C422.764 247.26 423.235 248.201 423.941 248.906C424.882 249.612 425.823 249.847 426.999 249.847C428.175 249.847 429.351 249.612 430.057 248.671C430.763 247.966 431.233 247.025 431.233 246.084C431.233 244.673 430.763 243.497 429.587 242.556C428.881 242.086 427.94 241.615 426.764 241.145C423.941 240.204 422.059 239.263 421.118 238.558C419 236.911 418.059 234.794 418.059 231.972C418.059 229.855 418.765 227.738 420.177 226.091C422.059 224.21 424.411 223.269 427.234 223.269C430.057 223.269 432.174 224.21 433.821 226.091C435.468 227.738 436.174 229.619 436.174 231.972H430.292C430.292 231.266 430.057 230.326 429.586 229.855C428.88 229.15 428.175 228.914 426.998 228.914C425.822 228.914 425.116 229.15 424.646 229.855C423.94 230.326 423.705 231.031 423.705 231.972C423.705 233.148 424.175 234.089 425.116 234.559C425.587 235.03 426.528 235.5 427.704 235.735C430.292 236.676 432.409 237.617 433.586 238.323C435.703 240.205 436.879 242.557 436.879 245.614L436.88 245.614ZM463.464 243.262V243.732C463.464 244.438 463.464 244.908 463.464 245.614H445.35C445.585 247.025 446.291 248.201 447.467 248.907C448.643 249.848 449.819 250.083 451.231 250.083C452.407 250.083 453.113 250.083 454.054 249.613C454.995 249.377 455.936 248.672 456.642 247.966H462.758C461.817 250.553 460.17 252.2 458.288 253.611C456.171 254.787 454.054 255.493 451.466 255.493C447.702 255.493 444.643 254.081 442.29 251.259C440.408 248.907 439.232 246.32 439.232 243.262C439.232 240.205 440.408 237.617 442.29 235.03C444.643 232.207 447.702 230.796 451.701 230.796C455.23 230.796 458.053 231.972 460.17 234.324C462.523 236.676 463.464 239.734 463.464 243.262L463.464 243.262ZM457.819 240.674C457.348 239.263 456.642 238.087 455.466 237.381C454.29 236.44 453.113 236.205 451.702 236.205C450.055 236.205 448.879 236.44 447.703 237.381C446.526 238.087 445.585 239.263 445.114 240.674H457.819ZM477.58 236.205C475.933 236.205 474.757 236.675 473.816 237.616C473.11 238.792 472.64 240.203 472.64 242.32V254.786H466.994V231.5H472.169V233.617C473.346 231.736 474.992 230.795 477.11 230.795C477.345 230.795 477.58 230.795 477.58 230.795V236.205ZM501.342 231.5L491.931 254.786H487.696L478.286 231.5H484.403L489.814 246.789L495.224 231.5H501.342ZM509.576 228.913H503.93V223.738H509.576V228.913ZM509.576 254.786H503.93V231.5H509.576V254.786ZM537.337 247.26C536.396 249.612 534.984 251.729 532.866 253.141C530.984 254.787 528.632 255.493 525.809 255.493C521.81 255.493 518.515 254.081 516.163 251.494C514.046 249.142 512.869 246.319 512.869 243.026C512.869 239.969 514.045 237.146 515.927 234.794C518.28 232.207 521.573 230.795 525.573 230.795C528.396 230.795 530.984 231.5 532.866 233.147C534.984 234.558 536.395 236.675 537.337 239.262H530.985C530.514 238.086 529.809 237.38 528.868 236.91C527.927 236.44 526.75 236.204 525.574 236.204C523.221 236.204 521.574 236.675 520.398 238.086C519.222 239.497 518.516 241.144 518.516 243.025C518.516 245.142 519.222 246.788 520.398 248.2C521.574 249.611 523.456 250.082 525.574 250.082C526.75 250.082 527.926 249.847 528.868 249.376C529.573 248.906 530.514 248.2 530.985 247.259H537.337V247.26ZM563.921 243.262V243.732C563.921 244.438 563.921 244.908 563.921 245.614H545.806C546.042 247.025 546.747 248.201 547.924 248.907C549.1 249.848 550.276 250.083 551.688 250.083C552.864 250.083 553.57 250.083 554.51 249.613C555.451 249.377 556.393 248.672 557.099 247.966H563.215C562.274 250.553 560.628 252.2 558.746 253.611C556.628 254.787 554.511 255.493 551.923 255.493C548.159 255.493 545.101 254.081 542.748 251.259C540.866 248.907 539.69 246.32 539.69 243.262C539.69 240.205 540.866 237.617 542.748 235.03C545.1 232.207 548.159 230.796 552.159 230.796C555.687 230.796 558.51 231.972 560.628 234.324C562.981 236.676 563.922 239.734 563.922 243.262L563.921 243.262ZM558.275 240.674C557.805 239.263 557.099 238.087 555.923 237.381C554.746 236.44 553.57 236.205 552.159 236.205C550.512 236.205 549.336 236.44 548.159 237.381C546.982 238.087 546.042 239.263 545.571 240.674H558.275ZM15.059 173.874V187.751H25.8805C27.9978 187.751 29.8804 187.046 31.0566 185.87C32.4681 184.458 33.1739 182.812 33.1739 180.695C33.1739 178.578 32.4681 176.931 31.0566 175.755C29.8804 174.579 27.9984 173.874 25.8805 173.874H15.059ZM15.059 150.823V163.054H24.7049C26.8221 163.054 28.2336 162.583 29.6451 161.407C30.8214 160.467 31.2919 158.82 31.2919 156.938C31.2919 155.056 30.8214 153.645 29.6451 152.469C28.2336 151.293 26.8221 150.823 24.7049 150.823H15.059ZM57.6411 199.746V138.827H73.4035V187.045H97.1649V199.746H57.6411ZM97.6354 199.746L121.161 138.827H135.747L159.273 199.746H143.51L139.276 187.28H117.867L113.632 199.746H97.6348H97.6354ZM128.454 156.703L121.867 175.285H135.041L128.454 156.703H128.454ZM169.39 191.985C163.744 186.105 160.685 178.578 160.685 169.17C160.685 159.996 163.743 152.469 169.39 146.589C175.272 140.709 182.564 137.651 191.739 137.651C199.503 137.651 206.796 140.003 213.854 144.943L207.502 155.763C202.797 152.469 198.327 150.823 193.857 150.823C188.917 150.823 184.682 152.47 181.623 155.998C178.565 159.291 176.918 163.76 176.918 169.17C176.918 174.579 178.564 179.049 181.623 182.577C184.682 185.87 188.916 187.516 193.857 187.516C198.327 187.516 202.797 185.87 207.502 182.577L213.854 193.632C206.796 198.336 199.503 200.688 191.739 200.688C182.564 200.688 175.271 197.866 169.39 191.985V191.985ZM220.912 199.747V138.828H236.204V164.466L257.613 138.828H275.728L251.025 167.288L276.669 199.747H258.318L240.439 176.932L236.204 181.871V199.747H220.913H220.912ZM338.778 199.747L334.778 195.043C329.838 198.806 324.662 200.688 319.251 200.688C312.9 200.688 307.723 199.041 303.724 195.749C299.724 192.221 297.607 187.751 297.607 182.342C297.607 178.814 298.783 175.755 300.665 172.933C302.783 170.11 305.606 167.758 309.37 165.876C305.606 161.878 303.959 157.644 303.959 153.645C303.959 148.941 305.606 145.177 309.135 142.12C312.428 139.062 316.899 137.651 322.31 137.651C327.486 137.651 331.955 139.062 335.249 141.885C338.542 144.472 340.189 148.235 340.189 152.469C340.189 159.525 336.425 164.935 328.426 168.934L336.19 177.402C337.131 175.285 337.601 172.698 337.837 169.404H350.541C350.306 176.461 348.188 182.341 344.66 187.516L355.246 199.747H338.778H338.778ZM311.958 181.166C311.958 183.282 312.899 185.164 314.546 186.575C316.192 187.986 318.31 188.692 320.663 188.692C323.015 188.692 325.133 187.986 327.25 186.34L316.192 173.639C313.369 175.755 311.958 178.108 311.958 181.166ZM322.31 149.647C320.898 149.647 319.722 150.117 318.781 150.823C317.84 151.764 317.369 152.94 317.369 154.351C317.369 155.997 318.781 158.114 321.369 160.466C325.133 158.584 327.015 156.468 327.015 154.116C327.015 152.704 326.545 151.764 325.604 150.823C324.898 150.117 323.722 149.647 322.31 149.647ZM462.995 138.828L444.645 199.747H429.353L418.766 158.82L408.179 199.747H392.888L374.538 138.828H390.3L400.887 179.754L411.474 138.828H426.06L436.647 179.754L447.233 138.828H462.996H462.995ZM469.112 199.747V138.828H484.874V162.114H509.341V138.828H525.104V199.747H509.341V174.815H484.874V199.747H469.112ZM537.102 199.747V138.828H552.864V199.747H537.102ZM577.096 199.747V151.529H560.393V138.828H609.798V151.529H593.094V199.747H577.097H577.096Z"
                                    fill="#1C1B17" />
                            </svg>
                            
                        </td>
                        <td style="width: 33.33%; text-align: end; vertical-align: top;">
                            <p style="margin-top: 20px; font-size: 8px;">
                                OOO «WHITEPARTNERS» <br>
                                г.Ташкент, Яккасарайский р-н, <br>
                                «Дамарик», МФЙ ул.Бобура, дом 83 <br>
                                р\с20208000705587012001, МФО 01033, <br>
                                ИНН 310016582, ОКЭД 96010 <br>
                                Почта индекс: 100100 <br>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style="width: 100%; margin-top: -20px;">
                <tbody>
                    <tr>
                        <td style="width: 33.33%; vertical-align: top; border-bottom: 1px solid;">
                           
                        </td>
                        <td style="width: 33.33%; vertical-align: top; text-align: center;">
                        </td>
                        <td style="width: 33.33%; text-align: end; vertical-align: top; border-bottom: 1px solid;">
                            <p style="font-size: 22px; margin: 0;">
                            (91) 024 24 24
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <td style="width: 33.33%; vertical-align: top;">
                            <p style="font-weight: 700; line-height: 1.2;">
                                Дата приема заказа: <br>
                                ${new Date(created).toLocaleDateString("Ru-ru")}г. <br>
                                <span style="font-weight: normal;">${new Date(created).toLocaleTimeString('Ru-ru', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })}</span>
                            </p>
                        </td>
                        <td style="width: 33.33%; vertical-align: top;">
                            <p style="line-height: 1.2; text-align:center; font-weight: bold;">
                                КВИТАНЦИЯ-ДОГОВОР <br>
                                Тариф ‹‹${current_tariff.name}››
                            </p>
                        </td>
                        <td style="width: 33.33%; vertical-align: top; text-align: end">
                            <p style="font-weight: 700; line-height: 1.2;">
                                Дата выдача заказа: <br>
                                ${delivery?.issues?.filter(e => e.type === 'FROM_DEPARTMENT_TO_CUSTOMER')[0]?.desired_delivery_time
        ? `${new Date(delivery?.issues?.filter(e => e.type === 'FROM_DEPARTMENT_TO_CUSTOMER')[0]?.desired_delivery_time).toLocaleDateString("Ru-ru")}г. <br>
                                <span style="font-weight: normal;">${new Date(delivery?.issues?.filter(e => e.type === 'FROM_DEPARTMENT_TO_CUSTOMER')[0]?.desired_delivery_time).toLocaleTimeString('Ru-ru', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })}</span> ` : `${new Date().toLocaleDateString("Ru-ru")}г. <br>
                                <span style="font-weight: normal;">${new Date().toLocaleTimeString('Ru-ru', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })}</span>`
    }
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="info-table" style="width: 100%; border-collapse: collapse;">
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; width: 500px;">Заказчик: ${user.display_name}</td>
                        <td style="border: 1px solid #000; width: 500px;">Тел: ${user.phone_number}</td>
                    </tr>
                </tbody>
            </table>
            <table class="info-table" style="width: 100%; border-collapse: collapse;">
<!--                <thead>-->
<!--                    <th style="border: 1px solid #000; font-weight: normal; text-align:left; background-color: #E6E7E9;">Наименование</th>-->
<!--                    <th style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 120px;">Кол-во</th>-->
<!--                    <th style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 150px;">Сумма</th>-->
<!--                </thead>-->
                <tbody>
                    ${itemsHtml.join('')}
                </tbody>
            </table>
            ${accessoriesHtml.length ? `<table  class="info-table" style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="
                        border: 0 solid #000;
                        line-height: 1.2;
                        text-align: center;
                        font-weight: bold;
                        padding: 5px;
                        font-size: 10px;
                    " colspan="3">АКСЕССУАРЫ</td>
                </tr>
                ${accessoriesHtml.join('')}
            </tbody>
        </table>` : ""}
            ${additionalServicesHtml.length ? `<table  class="info-table" style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="
                        border: 0 solid #000;
                        line-height: 1.2;
                        text-align: center;
                        font-weight: bold;
                        padding: 5px;
                        font-size: 10px;
                    " colspan="3">ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ ХИМЧИСТКИ</td>
                </tr>
                ${additionalServicesHtml.join('')}
            </tbody>
        </table>` : ""}
            ${order_items?.length ?
        `<table class="info-table" style="width: 100%; border-collapse: collapse; margin-top: 30px; border-bottom: 0;">
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; width: 600px;">Услуги химчистки</td>
                        <td style="border: 1px solid #000; text-align: center; background-color: #E6E7E9;width: 50px;"> ${order_items?.length ? order_items?.length : '0'} </td>
                        <td style="border: 1px solid #000; text-align: center; background-color: #E6E7E9;width: 150px;">
                             ${total_items_amount.toLocaleString('Ru-ru')} сум
                        </td>
                    </tr>
                </tbody>
            </table>` : ''}
            ${ parseInt(additional_services.map(e => e.price.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)) > 0 ?
        `<table class="info-table" style="width: 100%;  border-collapse: collapse; border-bottom: 0;">
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; border-top: 0; width: 600px;">Доп. услуги химчистки</td>
                        <td style="border: 1px solid #000; border-top: 0; text-align: center; background-color: #E6E7E9;width: 50px;"> ${additional_services.length} </td>
                        <td style="border: 1px solid #000; border-top: 0; text-align: center; background-color: #E6E7E9;width: 150px;">
                        ${parseInt(additional_services.map(e => e.price.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)).toLocaleString('Ru-ru')} сум
                        </td>
                    </tr>
                </tbody>
              </table>` : ""}
            ${ parseInt(accessories.map(e => e.total_amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)) > 0 ?
        `<table class="info-table" style="width: 100%; border-collapse: collapse; border-bottom: 0;">
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; border-top: 0; width: 600px;">Аксессуары</td>
                        <td style="border-bottom: 1px solid #000; text-align: center; background-color: #E6E7E9; width: 50px;"> ${accessories.map(e => e.count).reduce((accumulator, currentValue) => accumulator + currentValue, 0)} </td>
                        <td style="border: 1px solid #000; border-top: 0; text-align: center; background-color: #E6E7E9; width: 152px;">
                        ${parseInt(accessories.map(e => e.total_amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)).toLocaleString('Ru-ru')} сум
                        </td>
                    </tr>
                </tbody>
            </table>` : ""}
            <table class="info-table" style="width: 100%;  border-collapse: collapse; border-bottom: 0;">
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; border-top: 0; font-weight: normal; text-align:left; width: 400px;">Общее кол-во изделий</td>
                        <td style="border: 1px solid #000; border-top: 0; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;">${total_length}</td>
                    </tr>
                     ${immediate_order_additional_percent ? `
                    <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Срочно</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;"><span style="font-weight:bold;"> +${immediate_order_additional_percent || 0}%</span></td>
                    </tr>
                    `: ''}
                      ${parseInt(user.status?.order_total_amount_discount_percent) > 0 ? `<tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Скидка (Статус: ${user.status?.name})</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;">
                            <span style="font-weight:bold;"> 
                                -${parseInt(user.status?.order_total_amount_discount_percent).toLocaleString('ru-RU')}%
                            </span>
                        </td>
                    </tr>` : ''}
                       ${discount.promo_code_discount_percent ? `
                    <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Промокод</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;">
                            <span style="font-weight:bold;"> -${discount.promo_code_discount_percent || 0}%</span>
                        </td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Оплачено</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;"><span style="font-weight:bold;">${paid_amount.toLocaleString('Ru-ru')} сум</span></td>
                    </tr>
                     <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Остаток к оплате</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;">
                        <span style="font-weight:bold;">${remaining_amount.toLocaleString('Ru-ru')} сум</span>
                        </td>
                    </tr>
                    ${from_customer_to_department_price? `
                    <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Доставка от клиета</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;"><span style="font-weight:bold;">${from_customer_to_department_price} сум</span></td>
                    </tr>
                    ` : ''}
                    
                    ${from_department_to_customer_price? `
                    <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Доставка к клиету</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;"><span style="font-weight:bold;">${from_department_to_customer_price} сум</span></td>
                    </tr>
                    ` : ''}
                    
                    ${from_department_to_customer_extra_length? `
                    <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Доставка к клиета (Частично) ×${from_department_to_customer_extra_length}</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;"><span style="font-weight:bold;">${from_department_to_customer_extra_price} сум</span></td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>
            <p style="font-style:italic; margin-top: auto; font-size: 14px; margin-bottom: 3px;">Заказ принял приёмщик <small style="border-top: 1px solid black; font-size: 8px; transform: translateY(10px); display:inline-block;">подпись приёмщика</small> ${profile.display_name}</p>
            <p style="font-style:italic; font-size: 14px; margin-top: 3px;">С условиями договора, правилами и выполнения заказа смотрите на обороте </p>
        </div>
       <div style="margin-right: 10px;width: 50%; display: flex; flex-direction: column;">
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <td style="width: 33.33%; vertical-align: top;">
                            <span style="margin-bottom: 0; font-size: 22px; line-height: 0.5; display:block; margin-top: 20px;">№ ${order_id} <br> <span style="font-size: 14px;">${immediate_order_additional_percent ? 'срочный' : 'не срочный'}</span></span>
                        </td>
                        <td style="width: 33.33%; vertical-align: top; text-align: center;">
                            <svg style="width: 100px; height: 44px;" xmlns="http://www.w3.org/2000/svg" width="661"
                                height="263" viewBox="0 0 661 263" fill="none">
                                <path
                                    d="M0.00180214 199.749V138.829C0.00180214 127.304 4.94205 119.306 14.1174 113.191C19.9993 109.193 27.0568 107.546 34.3495 107.076L322.779 86.3771V64.9726C322.779 64.267 322.544 63.5614 322.073 62.8558C321.367 61.4446 320.19 60.5038 318.779 59.7982C318.308 59.7982 318.073 59.563 317.603 59.3278C313.368 56.7406 309.604 54.1534 306.31 50.1543C301.84 44.7447 300.194 38.1585 300.428 31.1024C300.428 29.2208 300.664 27.5744 301.134 25.6928C302.546 18.1664 306.545 11.5802 312.191 6.87614C317.837 2.17152 325.131 -0.415689 332.424 0.054713C334.07 0.054713 335.717 0.289912 337.364 0.525113C344.657 2.17152 350.774 6.16994 355.008 12.2858C359.243 18.6362 361.125 26.3984 360.89 33.9249C360.89 38.1585 357.361 41.2167 353.597 41.2167C349.597 40.9815 346.539 37.4535 346.539 33.2193C346.774 28.9856 345.833 24.7514 343.48 21.2234C341.363 18.1658 338.305 16.049 334.54 15.3434C333.599 15.1082 332.893 15.1082 331.952 15.1082C327.953 14.873 324.189 16.049 321.13 18.6362C318.072 21.2234 315.954 24.7514 315.014 28.7504C315.014 29.6912 314.779 30.632 314.779 31.5728C314.543 35.3361 315.955 38.3937 318.307 41.2167C320.189 43.3335 322.542 44.7447 324.895 46.1559V46.3911C329.6 48.5079 333.365 52.2711 335.482 57.4462C336.188 59.3278 336.893 61.6798 337.129 63.5614V63.7966V64.267V64.5022V82.8485V86.3765H336.423L624.852 107.075C632.145 107.546 639.203 109.192 645.084 113.191C654.26 119.306 659.2 127.303 659.2 138.829V151.06H633.086V162.585H656.612V174.581H633.086V187.283H660.611V199.749H617.323V138.829H645.79C645.79 128.95 634.497 121.189 625.322 120.953C526.748 112.72 428.174 108.251 329.6 99.5484C231.026 108.251 132.452 112.72 33.8778 120.953C24.7025 121.188 13.4105 128.95 13.4105 138.829H27.0556C32.7016 138.829 37.4072 140.241 41.1712 143.298C44.6999 146.592 46.5819 150.355 46.5819 155.294C46.5819 158.116 45.8762 160.704 44.6999 162.821C43.2884 164.938 41.6417 166.584 39.2886 167.76C42.3468 169.171 44.4641 171.053 46.1114 173.64C47.7582 175.992 48.6992 179.051 48.6992 182.343C48.6992 187.518 46.8172 191.517 42.8173 194.81C39.0533 198.103 34.3477 199.749 28.2312 199.749H0H0.00180214ZM584.624 235.501C586.506 235.501 588.152 236.912 588.152 239.029C588.152 240.911 586.506 242.557 584.624 242.557C582.506 242.557 580.86 240.911 580.86 239.029C580.86 236.912 582.506 235.501 584.624 235.501ZM73.6381 235.501C75.7554 235.501 77.4021 236.912 77.4021 239.029C77.4021 240.911 75.7554 242.557 73.6381 242.557C71.7561 242.557 70.1094 240.911 70.1094 239.029C70.1094 236.912 71.7561 235.501 73.6381 235.501ZM121.866 239.5C121.866 241.381 121.396 243.263 120.925 244.909C120.219 247.732 118.573 249.848 116.455 251.495C113.632 253.612 110.104 254.788 105.163 254.788H96.458V223.741H105.163C109.633 223.741 113.162 224.681 115.75 226.563C118.102 227.974 119.514 230.091 120.69 232.679C121.396 234.796 121.866 236.912 121.866 239.5ZM115.985 239.5C115.985 235.266 114.573 232.208 111.515 230.797C109.868 229.856 107.751 229.385 104.928 229.385H102.34V249.143H105.163C107.986 249.143 110.103 248.673 111.75 247.732C114.573 246.321 115.985 243.499 115.985 239.5ZM148.451 243.263V243.733C148.451 244.439 148.451 244.909 148.451 245.615H130.335C130.57 247.026 131.276 248.203 132.452 248.908C133.629 249.849 134.805 250.084 136.216 250.084C137.393 250.084 138.334 250.084 139.039 249.614C139.98 249.379 140.921 248.673 141.627 247.967H147.744C146.803 250.555 145.157 252.201 143.275 253.612C141.157 254.788 139.04 255.494 136.452 255.494C132.688 255.494 129.629 254.083 127.277 251.26C125.395 248.908 124.219 246.321 124.219 243.263C124.219 240.206 125.395 237.619 127.277 235.031C129.629 232.208 132.688 230.797 136.687 230.797C140.216 230.797 143.039 231.973 145.157 234.325C147.509 236.677 148.451 239.735 148.451 243.263V243.263ZM142.805 240.675C142.334 239.264 141.628 238.088 140.452 237.382C139.276 236.441 138.1 236.206 136.688 236.206C135.041 236.206 133.865 236.441 132.689 237.382C131.513 238.088 130.572 239.264 130.101 240.675H142.805H142.805ZM157.626 254.788H151.98V223.74H157.626V254.788ZM182.799 254.788H177.623V252.671C176.682 253.612 175.506 254.552 174.329 255.023C173.388 255.258 172.447 255.493 171.506 255.493C167.742 255.493 165.155 254.082 163.507 251.26C162.566 249.378 162.096 247.026 162.096 244.203V231.502H167.742V243.262C167.742 245.379 167.977 246.79 168.448 247.731C169.153 249.377 170.33 250.319 172.447 250.319C174.329 250.319 175.741 249.378 176.447 247.731C176.917 246.79 177.152 245.144 177.152 243.262V231.502H182.798V254.788H182.799ZM208.207 254.788H201.385L196.679 247.261L191.974 254.788H185.152L192.916 242.792L185.858 231.502H192.21L196.679 238.558L201.149 231.502H207.501L200.208 242.792L208.207 254.788H208.207ZM233.851 243.262V243.733C233.851 244.438 233.851 244.909 233.851 245.614H215.735C215.97 247.025 216.676 248.202 217.852 248.908C219.029 249.848 220.205 250.084 221.616 250.084C222.793 250.084 223.498 250.084 224.439 249.613C225.38 249.378 226.321 248.672 227.027 247.967H233.144C232.203 250.554 230.556 252.2 228.675 253.612C226.557 254.788 224.44 255.493 221.852 255.493C218.088 255.493 215.029 254.082 212.677 251.26C210.56 248.908 209.619 246.32 209.619 243.263C209.619 240.205 210.56 237.618 212.677 235.03C215.029 232.208 218.088 230.797 222.087 230.797C225.616 230.797 228.439 231.973 230.557 234.325C232.909 236.677 233.851 239.735 233.851 243.263V243.262ZM228.205 240.674C227.734 239.263 227.028 238.087 225.852 237.382C224.676 236.441 223.5 236.206 222.088 236.206C220.441 236.206 219.265 236.441 218.089 237.382C216.913 238.087 215.972 239.263 215.501 240.674H228.205H228.205ZM263.023 254.787H247.731V223.739H253.613V249.142H263.023V254.787ZM288.666 254.787H283.726V251.494C282.785 252.905 281.609 253.846 280.197 254.552C278.786 255.022 277.374 255.493 275.728 255.493C272.669 255.493 270.082 254.317 267.964 252.2C265.611 249.848 264.435 247.025 264.435 243.262C264.435 239.734 265.611 236.675 267.729 234.323C270.082 231.971 272.669 230.795 275.963 230.795C279.257 230.795 281.845 232.207 283.491 234.794L283.727 231.501H288.667V254.787H288.666ZM283.491 243.026C283.491 241.145 282.785 239.498 281.609 238.087C280.433 236.676 278.786 236.206 276.904 236.206C274.787 236.206 273.14 236.911 271.964 238.087C270.552 239.498 270.081 241.145 270.081 243.262C270.081 245.379 270.552 247.025 271.964 248.201C273.14 249.613 274.787 250.083 276.904 250.083C278.786 250.083 280.433 249.613 281.609 248.201C282.785 247.025 283.491 245.144 283.491 243.026ZM313.839 254.787H308.664V252.67C307.723 253.611 306.782 254.552 305.37 255.022C304.429 255.257 303.723 255.493 302.547 255.493C298.783 255.493 296.195 254.081 294.783 251.259C293.842 249.377 293.371 247.025 293.371 244.202V231.501H298.783V243.262C298.783 245.378 299.018 246.79 299.488 247.73C300.194 249.377 301.606 250.318 303.488 250.318C305.605 250.318 306.781 249.377 307.487 247.73C307.958 246.79 308.193 245.143 308.193 243.262V231.501H313.839V254.787H313.839ZM339.012 254.787H333.366V242.556C333.366 240.204 332.896 238.322 331.955 237.381C331.014 236.44 330.073 235.97 328.661 235.97C326.779 235.97 325.367 236.911 324.661 238.557C324.191 239.498 323.956 240.674 323.956 242.556V254.787H318.31V231.501H323.486V233.618C324.192 232.912 324.897 232.442 325.603 231.971C326.779 231.266 328.191 230.795 329.838 230.795C332.661 230.795 334.778 231.736 336.425 233.618C338.071 235.499 339.012 238.087 339.012 241.145V254.787ZM366.538 254.787H361.598V251.494C360.657 252.67 359.48 253.611 358.539 254.317C357.128 255.022 355.481 255.493 353.834 255.493C350.54 255.493 347.952 254.317 345.6 251.965C343.483 249.613 342.306 246.79 342.306 243.262C342.306 239.734 343.483 236.676 345.6 234.324C347.952 231.972 350.775 230.796 353.834 230.796C355.481 230.796 356.657 231.031 357.834 231.502C359.01 232.207 359.951 232.913 360.892 233.854L361.127 223.739H366.538V254.787H366.538ZM361.362 243.262C361.362 241.145 360.656 239.498 359.48 238.087C358.068 236.675 356.421 236.205 354.539 236.205C352.657 236.205 351.011 236.675 349.834 238.087C348.422 239.263 347.952 241.144 347.952 243.262C347.952 245.143 348.422 246.79 349.834 248.201C351.01 249.612 352.657 250.082 354.539 250.082C356.657 250.082 358.068 249.612 359.48 248.201C360.656 246.79 361.362 245.143 361.362 243.262ZM381.594 236.206C379.947 236.206 378.771 236.676 377.83 237.617C377.124 238.793 376.654 240.204 376.654 242.321V254.787H371.008V231.501H376.184V233.618C377.36 231.736 379.007 230.795 381.124 230.795C381.359 230.795 381.594 230.795 381.594 230.795V236.206H381.594ZM406.061 231.501L392.651 262.549H386.769L391.004 252.67L382.534 231.5H388.886L394.062 246.319L399.708 231.5H406.06L406.061 231.501ZM436.88 245.614C436.88 248.436 435.939 250.789 434.057 252.67C432.175 254.552 429.822 255.493 426.764 255.493C424.176 255.493 422.059 254.787 420.177 253.141C418.059 251.259 416.883 248.907 416.883 246.084H422.764C422.764 247.26 423.235 248.201 423.941 248.906C424.882 249.612 425.823 249.847 426.999 249.847C428.175 249.847 429.351 249.612 430.057 248.671C430.763 247.966 431.233 247.025 431.233 246.084C431.233 244.673 430.763 243.497 429.587 242.556C428.881 242.086 427.94 241.615 426.764 241.145C423.941 240.204 422.059 239.263 421.118 238.558C419 236.911 418.059 234.794 418.059 231.972C418.059 229.855 418.765 227.738 420.177 226.091C422.059 224.21 424.411 223.269 427.234 223.269C430.057 223.269 432.174 224.21 433.821 226.091C435.468 227.738 436.174 229.619 436.174 231.972H430.292C430.292 231.266 430.057 230.326 429.586 229.855C428.88 229.15 428.175 228.914 426.998 228.914C425.822 228.914 425.116 229.15 424.646 229.855C423.94 230.326 423.705 231.031 423.705 231.972C423.705 233.148 424.175 234.089 425.116 234.559C425.587 235.03 426.528 235.5 427.704 235.735C430.292 236.676 432.409 237.617 433.586 238.323C435.703 240.205 436.879 242.557 436.879 245.614L436.88 245.614ZM463.464 243.262V243.732C463.464 244.438 463.464 244.908 463.464 245.614H445.35C445.585 247.025 446.291 248.201 447.467 248.907C448.643 249.848 449.819 250.083 451.231 250.083C452.407 250.083 453.113 250.083 454.054 249.613C454.995 249.377 455.936 248.672 456.642 247.966H462.758C461.817 250.553 460.17 252.2 458.288 253.611C456.171 254.787 454.054 255.493 451.466 255.493C447.702 255.493 444.643 254.081 442.29 251.259C440.408 248.907 439.232 246.32 439.232 243.262C439.232 240.205 440.408 237.617 442.29 235.03C444.643 232.207 447.702 230.796 451.701 230.796C455.23 230.796 458.053 231.972 460.17 234.324C462.523 236.676 463.464 239.734 463.464 243.262L463.464 243.262ZM457.819 240.674C457.348 239.263 456.642 238.087 455.466 237.381C454.29 236.44 453.113 236.205 451.702 236.205C450.055 236.205 448.879 236.44 447.703 237.381C446.526 238.087 445.585 239.263 445.114 240.674H457.819ZM477.58 236.205C475.933 236.205 474.757 236.675 473.816 237.616C473.11 238.792 472.64 240.203 472.64 242.32V254.786H466.994V231.5H472.169V233.617C473.346 231.736 474.992 230.795 477.11 230.795C477.345 230.795 477.58 230.795 477.58 230.795V236.205ZM501.342 231.5L491.931 254.786H487.696L478.286 231.5H484.403L489.814 246.789L495.224 231.5H501.342ZM509.576 228.913H503.93V223.738H509.576V228.913ZM509.576 254.786H503.93V231.5H509.576V254.786ZM537.337 247.26C536.396 249.612 534.984 251.729 532.866 253.141C530.984 254.787 528.632 255.493 525.809 255.493C521.81 255.493 518.515 254.081 516.163 251.494C514.046 249.142 512.869 246.319 512.869 243.026C512.869 239.969 514.045 237.146 515.927 234.794C518.28 232.207 521.573 230.795 525.573 230.795C528.396 230.795 530.984 231.5 532.866 233.147C534.984 234.558 536.395 236.675 537.337 239.262H530.985C530.514 238.086 529.809 237.38 528.868 236.91C527.927 236.44 526.75 236.204 525.574 236.204C523.221 236.204 521.574 236.675 520.398 238.086C519.222 239.497 518.516 241.144 518.516 243.025C518.516 245.142 519.222 246.788 520.398 248.2C521.574 249.611 523.456 250.082 525.574 250.082C526.75 250.082 527.926 249.847 528.868 249.376C529.573 248.906 530.514 248.2 530.985 247.259H537.337V247.26ZM563.921 243.262V243.732C563.921 244.438 563.921 244.908 563.921 245.614H545.806C546.042 247.025 546.747 248.201 547.924 248.907C549.1 249.848 550.276 250.083 551.688 250.083C552.864 250.083 553.57 250.083 554.51 249.613C555.451 249.377 556.393 248.672 557.099 247.966H563.215C562.274 250.553 560.628 252.2 558.746 253.611C556.628 254.787 554.511 255.493 551.923 255.493C548.159 255.493 545.101 254.081 542.748 251.259C540.866 248.907 539.69 246.32 539.69 243.262C539.69 240.205 540.866 237.617 542.748 235.03C545.1 232.207 548.159 230.796 552.159 230.796C555.687 230.796 558.51 231.972 560.628 234.324C562.981 236.676 563.922 239.734 563.922 243.262L563.921 243.262ZM558.275 240.674C557.805 239.263 557.099 238.087 555.923 237.381C554.746 236.44 553.57 236.205 552.159 236.205C550.512 236.205 549.336 236.44 548.159 237.381C546.982 238.087 546.042 239.263 545.571 240.674H558.275ZM15.059 173.874V187.751H25.8805C27.9978 187.751 29.8804 187.046 31.0566 185.87C32.4681 184.458 33.1739 182.812 33.1739 180.695C33.1739 178.578 32.4681 176.931 31.0566 175.755C29.8804 174.579 27.9984 173.874 25.8805 173.874H15.059ZM15.059 150.823V163.054H24.7049C26.8221 163.054 28.2336 162.583 29.6451 161.407C30.8214 160.467 31.2919 158.82 31.2919 156.938C31.2919 155.056 30.8214 153.645 29.6451 152.469C28.2336 151.293 26.8221 150.823 24.7049 150.823H15.059ZM57.6411 199.746V138.827H73.4035V187.045H97.1649V199.746H57.6411ZM97.6354 199.746L121.161 138.827H135.747L159.273 199.746H143.51L139.276 187.28H117.867L113.632 199.746H97.6348H97.6354ZM128.454 156.703L121.867 175.285H135.041L128.454 156.703H128.454ZM169.39 191.985C163.744 186.105 160.685 178.578 160.685 169.17C160.685 159.996 163.743 152.469 169.39 146.589C175.272 140.709 182.564 137.651 191.739 137.651C199.503 137.651 206.796 140.003 213.854 144.943L207.502 155.763C202.797 152.469 198.327 150.823 193.857 150.823C188.917 150.823 184.682 152.47 181.623 155.998C178.565 159.291 176.918 163.76 176.918 169.17C176.918 174.579 178.564 179.049 181.623 182.577C184.682 185.87 188.916 187.516 193.857 187.516C198.327 187.516 202.797 185.87 207.502 182.577L213.854 193.632C206.796 198.336 199.503 200.688 191.739 200.688C182.564 200.688 175.271 197.866 169.39 191.985V191.985ZM220.912 199.747V138.828H236.204V164.466L257.613 138.828H275.728L251.025 167.288L276.669 199.747H258.318L240.439 176.932L236.204 181.871V199.747H220.913H220.912ZM338.778 199.747L334.778 195.043C329.838 198.806 324.662 200.688 319.251 200.688C312.9 200.688 307.723 199.041 303.724 195.749C299.724 192.221 297.607 187.751 297.607 182.342C297.607 178.814 298.783 175.755 300.665 172.933C302.783 170.11 305.606 167.758 309.37 165.876C305.606 161.878 303.959 157.644 303.959 153.645C303.959 148.941 305.606 145.177 309.135 142.12C312.428 139.062 316.899 137.651 322.31 137.651C327.486 137.651 331.955 139.062 335.249 141.885C338.542 144.472 340.189 148.235 340.189 152.469C340.189 159.525 336.425 164.935 328.426 168.934L336.19 177.402C337.131 175.285 337.601 172.698 337.837 169.404H350.541C350.306 176.461 348.188 182.341 344.66 187.516L355.246 199.747H338.778H338.778ZM311.958 181.166C311.958 183.282 312.899 185.164 314.546 186.575C316.192 187.986 318.31 188.692 320.663 188.692C323.015 188.692 325.133 187.986 327.25 186.34L316.192 173.639C313.369 175.755 311.958 178.108 311.958 181.166ZM322.31 149.647C320.898 149.647 319.722 150.117 318.781 150.823C317.84 151.764 317.369 152.94 317.369 154.351C317.369 155.997 318.781 158.114 321.369 160.466C325.133 158.584 327.015 156.468 327.015 154.116C327.015 152.704 326.545 151.764 325.604 150.823C324.898 150.117 323.722 149.647 322.31 149.647ZM462.995 138.828L444.645 199.747H429.353L418.766 158.82L408.179 199.747H392.888L374.538 138.828H390.3L400.887 179.754L411.474 138.828H426.06L436.647 179.754L447.233 138.828H462.996H462.995ZM469.112 199.747V138.828H484.874V162.114H509.341V138.828H525.104V199.747H509.341V174.815H484.874V199.747H469.112ZM537.102 199.747V138.828H552.864V199.747H537.102ZM577.096 199.747V151.529H560.393V138.828H609.798V151.529H593.094V199.747H577.097H577.096Z"
                                    fill="#1C1B17" />
                            </svg>
                        </td>
                        <td style="width: 33.33%; text-align: end; vertical-align: top;">
                            <p style="margin-top: 20px; font-size: 8px;">
                                OOO «WHITEPARTNERS» <br>
                                г.Ташкент, Яккасарайский р-н, <br>
                                «Дамарик», МФЙ ул.Бобура, дом 83 <br>
                                р\с20208000705587012001, МФО 01033, <br>
                                ИНН 310016582, ОКЭД 96010 <br>
                                Почта индекс: 100100 <br>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style="width: 100%; margin-top: -20px;">
                <tbody>
                    <tr>
                        <td style="width: 33.33%; vertical-align: top; border-bottom: 1px solid;">
                           
                        </td>
                        <td style="width: 33.33%; vertical-align: top; text-align: center;">
                        </td>
                        <td style="width: 33.33%; text-align: end; vertical-align: top; border-bottom: 1px solid;">
                            <p style="font-size: 22px; margin: 0;">
                            (91) 024 24 24
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <td style="width: 33.33%; vertical-align: top;">
                            <p style="font-weight: 700; line-height: 1.2;">
                                Дата приема заказа: <br>
                                ${new Date(created).toLocaleDateString("Ru-ru")}г. <br>
                                <span style="font-weight: normal;">${new Date(created).toLocaleTimeString('Ru-ru', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })}</span>
                            </p>
                        </td>
                        <td style="width: 33.33%; vertical-align: top;">
                            <p style="line-height: 1.2; text-align:center; font-weight: bold;">
                                КВИТАНЦИЯ-ДОГОВОР <br>
                                Тариф ‹‹${current_tariff.name}››
                            </p>
                        </td>
                        <td style="width: 33.33%; vertical-align: top; text-align: end">
                            <p style="font-weight: 700; line-height: 1.2;">
                                Дата выдача заказа: <br>
                                ${delivery?.issues?.filter(e => e.type === 'FROM_DEPARTMENT_TO_CUSTOMER')[0]?.desired_delivery_time
        ? `${new Date(delivery?.issues?.filter(e => e.type === 'FROM_DEPARTMENT_TO_CUSTOMER')[0]?.desired_delivery_time).toLocaleDateString("Ru-ru")}г. <br>
                                <span style="font-weight: normal;">${new Date(delivery?.issues?.filter(e => e.type === 'FROM_DEPARTMENT_TO_CUSTOMER')[0]?.desired_delivery_time).toLocaleTimeString('Ru-ru', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })}</span> ` : `${new Date().toLocaleDateString("Ru-ru")}г. <br>
                                <span style="font-weight: normal;">${new Date().toLocaleTimeString('Ru-ru', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })}</span>`
    }
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="info-table" style="width: 100%; border-collapse: collapse;">
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; width: 500px;">Заказчик: ${user.display_name}</td>
                        <td style="border: 1px solid #000; width: 500px;">Тел: ${user.phone_number}</td>
                    </tr>
                </tbody>
            </table>
            <table class="info-table" style="width: 100%; border-collapse: collapse;">
<!--                <thead>-->
<!--                    <th style="border: 1px solid #000; font-weight: normal; text-align:left; background-color: #E6E7E9;">Наименование</th>-->
<!--                    <th style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 120px;">Кол-во</th>-->
<!--                    <th style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 150px;">Сумма</th>-->
<!--                </thead>-->
                <tbody>
                    ${itemsHtml.join('')}
                </tbody>
            </table>
            ${accessoriesHtml.length ? `<table  class="info-table" style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="
                        border: 0 solid #000;
                        line-height: 1.2;
                        text-align: center;
                        font-weight: bold;
                        padding: 5px;
                        font-size: 10px;
                    " colspan="3">АКСЕССУАРЫ</td>
                </tr>
                ${accessoriesHtml.join('')}
            </tbody>
        </table>` : ""}
            ${additionalServicesHtml.length ? `<table  class="info-table" style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="
                        border: 0 solid #000;
                        line-height: 1.2;
                        text-align: center;
                        font-weight: bold;
                        padding: 5px;
                        font-size: 10px;
                    " colspan="3">ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ ХИМЧИСТКИ</td>
                </tr>
                ${additionalServicesHtml.join('')}
            </tbody>
        </table>` : ""}
            ${order_items?.length ?
        `<table class="info-table" style="width: 100%; border-collapse: collapse; margin-top: 30px; border-bottom: 0;">
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; width: 600px;">Услуги химчистки</td>
                        <td style="border: 1px solid #000; text-align: center; background-color: #E6E7E9;width: 50px;"> ${order_items?.length ? order_items?.length : '0'} </td>
                        <td style="border: 1px solid #000; text-align: center; background-color: #E6E7E9;width: 150px;">
                             ${total_items_amount.toLocaleString('Ru-ru')} сум
                        </td>
                    </tr>
                </tbody>
            </table>` : ''}
            ${ parseInt(additional_services.map(e => e.price.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)) > 0 ?
        `<table class="info-table" style="width: 100%;  border-collapse: collapse; border-bottom: 0;">
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; border-top: 0; width: 600px;">Доп. услуги химчистки</td>
                        <td style="border: 1px solid #000; border-top: 0; text-align: center; background-color: #E6E7E9;width: 50px;"> ${additional_services.length} </td>
                        <td style="border: 1px solid #000; border-top: 0; text-align: center; background-color: #E6E7E9;width: 150px;">
                        ${parseInt(additional_services.map(e => e.price.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)).toLocaleString('Ru-ru')} сум
                        </td>
                    </tr>
                </tbody>
              </table>` : ""}
            ${ parseInt(accessories.map(e => e.total_amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)) > 0 ?
        `<table class="info-table" style="width: 100%; border-collapse: collapse; border-bottom: 0;">
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; border-top: 0; width: 600px;">Аксессуары</td>
                        <td style="border-bottom: 1px solid #000; text-align: center; background-color: #E6E7E9; width: 50px;"> ${accessories.map(e => e.count).reduce((accumulator, currentValue) => accumulator + currentValue, 0)} </td>
                        <td style="border: 1px solid #000; border-top: 0; text-align: center; background-color: #E6E7E9; width: 152px;">
                        ${parseInt(accessories.map(e => e.total_amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)).toLocaleString('Ru-ru')} сум
                        </td>
                    </tr>
                </tbody>
            </table>` : ""}
            <table class="info-table" style="width: 100%;  border-collapse: collapse; border-bottom: 0;">
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; border-top: 0; font-weight: normal; text-align:left; width: 400px;">Общее кол-во изделий</td>
                        <td style="border: 1px solid #000; border-top: 0; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;">${total_length}</td>
                    </tr>
                     ${immediate_order_additional_percent ? `
                    <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Срочно</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;"><span style="font-weight:bold;"> +${immediate_order_additional_percent || 0}%</span></td>
                    </tr>
                    `: ''}
                      ${parseInt((+remaining_amount / 100) * user.status?.order_total_amount_discount_percent || 0) > 0 ? `<tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Скидка (Статус: ${user.status?.name})</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;">
                            <span style="font-weight:bold;"> 
                                -${parseInt((+remaining_amount / 100) * user.status?.order_total_amount_discount_percent || 0).toLocaleString('ru-RU')} сум
                            </span>
                        </td>
                    </tr>` : ''}
                       ${discount.promo_code_discount_percent ? `
                    <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Промокод</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;">
                            <span style="font-weight:bold;"> -${discount.promo_code_discount_percent || 0}% (Скидка)</span>
                        </td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Оплачено</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;"><span style="font-weight:bold;">${paid_amount.toLocaleString('Ru-ru')} сум</span></td>
                    </tr>
                     <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Остаток к оплате</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;">
                        <span style="font-weight:bold;">${remaining_amount.toLocaleString('Ru-ru')} сум</span>
                        </td>
                    </tr>
                    ${from_customer_to_department_price? `
                    <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Доставка от клиета</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;"><span style="font-weight:bold;">${from_customer_to_department_price} сум</span></td>
                    </tr>
                    ` : ''}
                    
                    ${from_department_to_customer_price? `
                    <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Доставка к клиету</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;"><span style="font-weight:bold;">${from_department_to_customer_price} сум</span></td>
                    </tr>
                    ` : ''}
                    
                    ${from_department_to_customer_extra_length? `
                    <tr>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:left; width: 400px;">Доставка к клиета (Частично) ×${from_department_to_customer_extra_length}</td>
                        <td style="border: 1px solid #000; font-weight: normal; text-align:center; background-color: #E6E7E9; width: 165px;"><span style="font-weight:bold;">${from_department_to_customer_extra_price} сум</span></td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>
            <p style="font-style:italic; margin-top: auto; font-size: 14px; margin-bottom: 3px;">Заказ принял приёмщик <small style="border-top: 1px solid black; font-size: 8px; transform: translateY(10px); display:inline-block;">подпись приёмщика</small> ${profile.display_name}</p>
            <p style="font-style:italic; font-size: 14px; margin-top: 3px;">С условиями договора, правилами и выполнения заказа смотрите на обороте </p>
        </div>
    </div>
</body>

</html>
    `
    myWindow.document.write(html)
    myWindow.print();
}