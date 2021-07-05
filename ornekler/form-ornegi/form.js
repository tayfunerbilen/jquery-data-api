// setState('form1', {});

const parseJson = (data) => {
    return JSON.stringify(data, null, 2);
}

const getData = () => {
    alert('bilgileri görmek için console a bakın!');
    console.log($state.form1);
}