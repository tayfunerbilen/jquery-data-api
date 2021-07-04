const $state = {},
    $watchStates = true,
    $debug = true;

const setWatchStates = function(val) {
    $watchStates = val;
}

if ($debug) {
    window.onerror = function(event, source, line, col, error) {
        const div = $('<div>');
        div.css({
            backgroundColor: 'red',
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: '999999',
            color: '#fff',
            padding: '15px'
        }).html(event);
        div.appendTo('body');
    }
}

const setState = function(name, value) {
    setStateEvent(name, value, $state[name]);
    $state[name] = value;
    watchExpressions();
}

const updateState = function(name, value) {
    setStateEvent(name, value, $state[name]);
    $state[name] = value;
    watchExpressions();
}

const watchStates = function() {

    /*
        Checkbox, select, radio ve file inputları hariç diğer inputları kontrol eder.
    */
    $(document).on('keyup keypress', '[data-input]', function(){
        let name = $(this).data('state'),
            value = $(this).val();
        if ( value.match(/^[0-9\.\,]+$/) ) {
            value = parseFloat(value);
        }
        if ($state[name] !== value) {
            setStateEvent(name, value, $state[name]);
            $state[name] = value;
            watchExpressions();
        }
    });

    /*
        input[type="checkbox"] etiketlerini kontrol eder
    */
    $(document).on('change', '[data-checkbox]', function(){
        const name = $(this).data('state'),
            value = $(this).prop('checked');
        if ($state[name] !== value) {
            setStateEvent(name, value, $state[name]);
            $state[name] = value;
            watchExpressions();
        }
    });

    /*
        input[type="radio"] etiketlerini kontrol eder
    */
    $(document).on('change', '[data-radio]', function(){
        const name = $(this).data('state'),
            value = $(this).val();
        if ($state[name] !== value) {
            setStateEvent(name, value, $state[name]);
            $state[name] = value;
            watchExpressions();
        }
    });

    /*
        input[type="file"] etiketlerini kontrol eder
    */
    $(document).on('change', '[data-file]', function(){
        let name = $(this).data('state'),
            value = $(this)[0].files;
        if ( !$(this).attr('multiple') ) {
            value = value[0];
        }
        if ($state[name] !== value) {
            setStateEvent(name, value, $state[name]);
            $state[name] = value;
            watchExpressions();
        }
    });

    /*
        Select etiketlerini kontrol eder
    */
    $(document).on('change', '[data-select]', function(){
        const name = $(this).data('state'),
            value = $(this).val();
        if (typeof value !== 'array' && $state[name] !== value) {
            setStateEvent(name, value, $state[name]);
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

    $('[data-class]').each(function(){
        const [condition, className] = eval($(this).data('class'));
        if (condition) {
            $(this).addClass(className);
        } else {
            $(this).removeClass(className);
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

    $('[data-show]').each(function(){
        const condition = eval($(this).data('show'));
        if (condition) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

const stateEffect = function(callback, states = []) {
    $.each(states, (key, state) => {
        $(document).on(state, function(event, newValue, oldValue) {
            callback(newValue, oldValue, state);
        });
    });
}

const updateBlocks = function() {
    $('[data-block]').each(function(){
        let html = $(this).html();
        html = html.replaceAll(/\{(.*?)\}/gsu, function(expression, content) {
            content = content.replaceAll('&amp;', '&').replaceAll('&gt;', '>').replaceAll('&lt;', '<');
            if (content.match(/[\?\&\=\s\+]+/g)) {
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
    
        if ( $(this).is('input:not(:checkbox):not(:radio):not(:file)') ) {
            value = $(this).val();
            if ( value.match(/^[0-9\.\,]+$/) ) {
                value = parseFloat(value);
            }
            $(this).attr('data-input', '');
        }

        if ( $(this).is(':checkbox') ) {
            value = $(':checked', this).val();
            $(this).attr('data-checkbox', '');
        }

        if ( $(this).is(':radio') ) {
            value = $(this).filter(':checked').val();
            $(this).attr('data-radio', '');
        }

        if ( $(this).is(':file') ) {
            value = false;
            $(this).attr('data-file', '');
        }

        if ( $(this).is('select') ) {
            value = $('option:selected', this).val();
            $(this).attr('data-select', '');
        }
    
        if (!$state[name]) {
            $state[name] = value;
        }

        setStateEvent(name, value, value);
    
    });
}

const setStateEvent = function(key, newValue, oldValue) {
    $(document).trigger(key, [newValue, oldValue]);
}

setDomStates();
updateBlocks();
if ($watchStates) {
    watchStates();
}
watchExpressions();

//setState('accept', false);

stateEffect((value, oldValue, state) => {
    // console.log('state changed', value, oldValue, state);
}, ['avatar']);