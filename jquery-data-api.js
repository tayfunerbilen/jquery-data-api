
const $state = {};

let $watchStates = true,
    $debug = false;

const setWatchStates = function(val) {
    $watchStates = val;
}

if ($debug) {
    window.onerror = function(msg) {
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
        }).html(msg);
        div.appendTo('body');
    }
}

const stateUpdateDepth = (name, value) => {
    const split = name.split('.');
    if (split.length > 1) {
        return $state[split[0]][split[1]] = value;
    }
    return $state[name] = value;
}

const stateCheckDepth = (name, value) => {
    const split = name.split('.');
    if (split.length > 1) {
        return $state[split[0]][split[1]];
    }
    return $state[name];
}

const setState = function(name, value) {
    const oldValue = $state[name];
    stateUpdateDepth(name, value);
    setStateEvent(name, value, oldValue);
    updateDom(name, value);
    watchExpressions();
}

const updateState = function(name, value) {
    const oldValue = $state[name];
    stateUpdateDepth(name, value);
    setStateEvent(name, value, oldValue);
    watchExpressions();
    updateDom(name, value);
}

const updateDom = function(name, value) {
    const el = $('[data-state="' + name + '"]');

    if ( el.is('input:not(:checkbox):not(:radio):not(:file)') ) {
        el.val(value);
    }

    if ( el.is(':checkbox') ) {
        el.prop('checked', value);
    }

    if ( el.is(':radio') ) {
        el.prop('checked', value);
    }

    if ( el.is(':file') ) {
        el.val(value);
    }

    if ( el.is('select') ) {
        el.find('option[value="' + value + '"]').attr('selected', 'selected');
    }

    const forLoopBlock = $('[data-for="' + name + '"]');
    if (forLoopBlock.length) {
        let template = forLoopBlock.find('template').clone();
        forLoopBlock.html('').append(template);
        $.each(value, function(key, item) {
            eval('var ' + forLoopBlock.data('as') + ' = ' + JSON.stringify(item) + ';');
            let template = forLoopBlock.find('template').html();
            template = template.replaceAll(/\{(.*?)\}/g, function(match, contents) {
                contents = contents
                    .replaceAll('&amp;', '&')
                    .replaceAll('&gt;', '>')
                    .replaceAll('&lt;', '<');
                if (typeof eval(contents) === 'object') {
                    return JSON.stringify(eval(contents)).replaceAll('"', "'");
                }
                return eval(contents);
            });
            forLoopBlock.append(template);
        });
        // updateBlocks();
    }

}

const watchStates = function() {

    /*
        Checkbox, select, radio ve file inputları hariç diğer inputları kontrol eder.
    */
    $(document).on('keyup keypress input', '[data-input]', function(){
        let name = $(this).data('state'),
            value = $(this).val();
        if ( value.match(/^[0-9\.\,]+$/) ) {
            value = parseFloat(value);
        }
        if (stateCheckDepth(name) !== value) {
            setStateEvent(name, value, $state[name]);
            stateUpdateDepth(name, value);
            watchExpressions();
        }
    });

    /*
        input[type="checkbox"] etiketlerini kontrol eder
    */
    $(document).on('change', '[data-checkbox]', function(){
        const name = $(this).data('state'),
            value = $(this).prop('checked');
        if (stateCheckDepth(name) !== value) {
            setStateEvent(name, value, $state[name]);
            stateUpdateDepth(name, value);
            watchExpressions();
        }
    });

    /*
        input[type="radio"] etiketlerini kontrol eder
    */
    $(document).on('change', '[data-radio]', function(){
        const name = $(this).data('state'),
            value = $(this).val();
        if (stateCheckDepth(name) !== value) {
            setStateEvent(name, value, $state[name]);
            stateUpdateDepth(name, value);
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
        if (stateCheckDepth(name) !== value) {
            setStateEvent(name, value, $state[name]);
            stateUpdateDepth(name, value);
            watchExpressions();
        }
    });

    /*
        Select etiketlerini kontrol eder
    */
    $(document).on('change', '[data-select]', function(){
        const name = $(this).data('state'),
            value = $(this).val();
        if (typeof value !== 'object' && stateCheckDepth(name) !== value) {
            setStateEvent(name, value, $state[name]);
            stateUpdateDepth(name, value);
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
        if ($(this).html() !== stateCheckDepth($(this).data('text'))) {
            $(this).html(stateCheckDepth($(this).data('text')));
        }
    });

    $('[data-expression]').each(function(){
        const expression = eval($(this).data('expression'));
        $(this).html(expression);
    });

    $('[data-show]').each(function(){
        const condition = eval($(this).data('show')),
            effectFade = $(this).data('fade'),
            effectSlide = $(this).data('slide');
        if (condition) {
            if (effectFade) {
                $(this).fadeIn(effectFade);
            } else if (effectSlide) {
                $(this).slideDown(effectSlide);
            } else {
                $(this).show();
            }
        } else {
            if (effectFade) {
                $(this).fadeOut(effectFade);
            } else if (effectSlide) {
                $(this).slideUp(effectSlide);
            } else {
                $(this).hide();
            }
        }
    });
}

const stateEffect = function(callback, states = false) {
    if (states){
        $.each(states, (key, state) => {
            $(document).on(state, function(event, newValue, oldValue) {
                callback(newValue, oldValue, state);
            });
        });
    } else {
        callback();
    }
}

const updateBlocks = function() {
    $('[data-block]').each(function(){
        let html = $(this).html();
        
        html = html.replaceAll(/\$\{(.*?)\}/g, '###$1###');
        html = html.replaceAll(/\{(.*?)\}/gsu, function(expression, content) {
            content = content
                .replaceAll('&amp;', '&')
                .replaceAll('&gt;', '>')
                .replaceAll('&lt;', '<')
                .replaceAll(/###(.*?)###/g, '${$1}');
            if (content.match(/[\?\&\=\s\+\(\)]+/g)) {
                return `<span data-expression="${content}">${eval(content)}</span>`;
            }
            return `<span data-text="${content.replace('$state.', '')}">${eval(content)}</span>`;
        });
        $(this).html(html);
    });
}

const setDomStates = function() {
    $('[data-state]').each(function(){

        const name = $(this).data('state'),
            nameSplited = name.split('.');
        let value = $(this).data('value') ? eval($(this).data('value')) : null;

        var _state;
        if (nameSplited.length > 1) {
            if (typeof $state[nameSplited[0]] === 'undefined') {
                $state[nameSplited[0]] = {};
            }
            _state = $state[nameSplited[0]][nameSplited[1]] = value;
        } else {
            _state = $state[name]
        }
    
        if ( $(this).is('input:not(:checkbox):not(:radio):not(:file)') ) {
            value = $(this).val() || null;
            if ( value && value.match(/^[0-9\.\,]+$/) ) {
                value = parseFloat(value);
            }
            $(this).attr('data-input', '');
            if (_state) {
                $(this).val(_state);
            }
        }

        if ( $(this).is(':checkbox') ) {
            value = $(this).prop('checked') || false;
            if (_state) {
                $(this).prop('checked', _state);
            }
            $(this).attr('data-checkbox', '');
        }

        if ( $(this).is(':radio') ) {
            if (!value) {
                value = $(this).filter(':checked').val() || false;
            }
            if (_state) {
                $(this).prop('checked', _state);
            }
            $(this).attr('data-radio', '');
        }

        if ( $(this).is(':file') ) {
            value = false;
            $(this).attr('data-file', '');
        }

        if ( $(this).is('select') ) {
            if ($(this).attr('multiple')) {
                value = $(this).val();
            } else {
                value = $('option:selected:not(:disabled)', this).val() || null;
            }
            if (_state) {
                if (typeof _state === 'object') {
                    $.each(_state, function(key, val) {
                        $(this).find('option[value="' + val + '"]').prop('selected', true);
                    }.bind(this));
                } else {
                    $(this).find('option[value="' + _state + '"]').attr('selected', 'selected');
                }
            }
            $(this).attr('data-select', '');
        }
    
        if (!_state) {
            if (nameSplited.length > 1) {
                $state[nameSplited[0]][nameSplited[1]] = value;
            } else {
                $state[name] = value;
            }
        }
        setStateEvent(name, value, value);
    
    });
}

const setStateEvent = function(key, newValue, oldValue) {
    $(document).trigger(key, [newValue, oldValue]);
}

const getState = function(name) {
    return $state[name];
}

const dataApiInit = () => {
    setDomStates();
    updateBlocks();
    if ($watchStates) {
        watchStates();
    }
    watchExpressions();
}

dataApiInit();