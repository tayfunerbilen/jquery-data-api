stateEffect((tab, oldTab, state) => {
    console.log('Tab değişti', 'yeni değer = ' + tab, 'eski değer = ' + oldTab);
}, ['tab'])