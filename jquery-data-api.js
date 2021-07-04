const $state = {},
    $watchStates = true;

const setWatchStates = function(val) {
    $watchStates = val;
}

const setState = function(name, value) {
    $state[name] = value;
    setStateEvent(name, value);
    watchExpressions();
}

const updateState = function(name, value) {
    $state[name] = value;
    setStateEvent(name, value);
    watchExpressions();
}

const watchStates = function() {

    /*
        Checkbox, radio ve file inputları hariç diğer inputları kontrol eder.
    */
    $(document).on('keyup keypress', '[data-input]', function(){
        const name = $(this).data('state'),
            value = $(this).val();
        if ($state[name] !== value) {
            setStateEvent(name, value);
            $state[name] = value;
            watchExpressions();
        }
    });

    /*
        Checkboxları kontrol eder
    */
    $(document).on('change', '[data-checkbox]', function(){
        const name = $(this).data('state'),
            value = $(this).prop('checked');
        if ($state[name] !== value) {
            setStateEvent(name, value);
            $state[name] = value;
            watchExpressions();
        }
    });

}

const watchExpressions = function() {
    $('[data-disabled]').each(function(){
        const disabled = eval($(this).data('disabled'));
        if (disabled) {
            $(this).attr('disabled', 'disabled');
        } else {
            $(this).removeAttr('disabled');
        }
    });

    $('[data-text]').each(function(){
        if ($(this).html() !== $state[$(this).data('text')]) {
            $(this).html($state[$(this).data('text')]);
        }
    });

    $('[data-expression]').each(function(){
        const expression = eval($(this).data('expression'));
        $(this).html(expression);
    });
}

const stateEffect = function(callback, states = []) {
    $.each(states, (key, state) => {
        $(document).on(state, function(event, value) {
            callback(value, state);
        });
    });
}

const updateBlocks = function() {
    $('[data-block]').each(function(){
        let html = $(this).html();
        html = html.replaceAll(/\{(.*?)\}/g, function(expression, content) {
            content = content.replaceAll('&amp;', '&');
            if (content.match(/[\?\&\=]+/g)) {
                return `<span data-expression="${content}">${eval(content)}</span>`;
            }
            return `<span data-text="${content.replace('$state.', '')}">${eval(content)}</span>`;
        });
        $(this).html(html);
    });
}

const setDomStates = function() {
    $('[data-state]').each(function(){

        const name = $(this).data('state');
        let value;
    
        if ( $(this).is(':input:not(:checkbox)') ) {
            value = $(this).val();
            $(this).attr('data-input', '');
        }

        if ( $(this).is(':checkbox') ) {
            value = $(':checked', this).val();
            $(this).attr('data-checkbox', '');
        }
    
        if (!$state[name]) {
            $state[name] = value;
        }

        setStateEvent(name, value);
    
    });
}

const setStateEvent = function(key, value) {
    $(document).trigger(key, [value]);
}

setDomStates();
updateBlocks();
if ($watchStates) {
    watchStates();
}
watchExpressions();

//setState('accept', false);

stateEffect((value, state) => {
    console.log('state changed', value, state);
}, ['accept', 'name', 'surname']);