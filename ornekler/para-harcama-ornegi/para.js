const moneyFormat = (price) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
}

const getAmount = (id) => {
    const find = $state.basket.find(item => item.id === id)
    if (find) {
        return find.amount;
    }
    return 0;
}

const addBasket = (product) => {
    const checkBasket = $state.basket.find(item => item.id === product.id)

    // ürün daha önce eklenmiş
    if (checkBasket) {
        checkBasket.amount += 1
        updateState('basket', [...$state.basket.filter(item => item.id !== product.id), checkBasket])
    } else {
        updateState('basket', [...$state.basket, {
            id: product.id,
            amount: 1
        }])
    }
}

const removeBasket = (product) => {
    const currentBasket = $state.basket.find(item => item.id === product.id)
    const basketWithoutCurrent = $state.basket.filter(item => item.id !== product.id)
    currentBasket.amount -= 1
    if (currentBasket.amount === 0) {
        updateState('basket', [...basketWithoutCurrent])
    } else {
        updateState('basket', [...basketWithoutCurrent, currentBasket])
    }
}

const resetBasket = () => {
    updateState('basket', []);
}

const getProduct = (id) => {
    return $state.items.find(p => p.id === id)
}

$(document).on('jq-data-api', function(){
    setState('basket', []);
    setState('total', 0);
    setState('money', 750000);
    const items = [
        {
            id: 1,
            name: 'Ekmek',
            price: 1
        },
        {
            id: 2,
            name: 'Ayakkabı',
            price: 50
        },
        {
            id: 3,
            name: 'Tişört',
            price: 25
        },
        {
            id: 4,
            name: 'Motor',
            price: 5500
        },
        {
            id: 5,
            name: 'Araba',
            price: 100000
        }
    ];
    setState('items', items);

    stateEffect((basket) => {
        updateState(
            'total',
            basket.reduce((acc, item) => {
                return acc + (item.amount * ($state.items.find(product => product.id === item.id).price))
            }, 0)
        )
    }, ['basket'])

    // eğer etkilenecek state varsa diğer stateEffect'ten önce tanımlamak gerekiyor
    // bu örnekte basket stateini güncelleyip yukarıda ise güncellenen değeri alabiliyoruz
    stateEffect(() => {
        const basket = [
            {
                id: 3,
                amount: 2
            }
        ];
        updateState('basket', basket);
    });
});