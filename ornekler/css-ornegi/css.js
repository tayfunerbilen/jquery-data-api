setState('max', 24);
setState('min', 8);
setState('error', false);

const decreaseFont = () => {
    if ($state.font - 2 >= $state.min){
        updateState('font', $state.font - 2);
        updateState('error', false);
    } else {
        updateState('error', 'Minimum font boyutuna ulaştınız!');
    }
}

const increaseFont = () => {
    if ($state.font + 2 <= $state.max){
        updateState('font', $state.font + 2);
        updateState('error', false);
    } else {
        updateState('error', 'Maksimum font boyutuna ulaştınız!');
    }
}