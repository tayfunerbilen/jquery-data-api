const $state = {};

let $watchStates = true,
    $debug = false;

const setWatchStates = function (val) {
    $watchStates = val;
}

if ($debug) {
    window.onerror = function (msg) {
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

const setState = function (name, value) {
    const oldValue = $state[name];
    stateUpdateDepth(name, value);
    setStateEvent(name, value, oldValue);
    updateDom(name, value);
    watchExpressions();
}

const updateState = function (name, value) {
    const oldValue = $state[name];
    stateUpdateDepth(name, value);
    updateDom(name, value);
    setStateEvent(name, value, oldValue);
    watchExpressions();
}

const updateDom = function (name, value) {

    let el;
    for (v in value) {

        if (!$.isNumeric(v)) {
            el = $('[data-state="' + name + '.' + v + '"]');
            value = eval('$state.' + name + '.' + v);
        }

        if (!el) {
            el = $('[data-state="' + name + '"]')
        }

        if (el.is('input:not(:checkbox):not(:radio):not(:file)')) {
            el.val(value);
        }

        if (el.prop('tagName') === 'TEXTAREA') {
            el.val(value);
        }

        if (el.is(':checkbox')) {
            el.prop('checked', value);
        }

        if (el.is(':radio')) {
            el.prop('checked', value);
        }

        if (el.is(':file')) {
            el.val(value);
        }

        if (el.is('select')) {
            if (el.attr('multiple') && typeof value === 'object') {
                el.find('option').each(function () {
                    if (value.includes($(this).val()) || value.includes(parseFloat($(this).val()))) {
                        $(this).attr('selected', 'selected');
                    }
                });
            } else {
                el.find('option[value="' + value + '"]').attr('selected', 'selected');
            }
        }

        const forLoopBlock = $('[data-for="' + name + '"]');
        if (forLoopBlock.length) {
            let template = forLoopBlock.find('template').clone();
            forLoopBlock.html('').append(template);
            $.each(value, function (key, item) {
                eval('var ' + forLoopBlock.data('as') + ' = ' + JSON.stringify(item) + ';');
                let template = forLoopBlock.find('template').html();
                template = template.replaceAll(/\{(.*?)\}/g, function (match, contents) {
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

}

const watchStates = function () {

    /*
        Checkbox, select, radio ve file inputlar?? hari?? di??er inputlar?? kontrol eder.
    */
    $(document).off('keyup keypress input', '[data-input]').on('keyup keypress input', '[data-input]', function () {
        let name = $(this).data('state'),
            value = $(this).val();
        if (value.match(/^[0-9\.\,]+$/)) {
            value = parseFloat(value);
        }
        if (stateCheckDepth(name) !== value) {
            setStateEvent(name, value, $state[name]);
            stateUpdateDepth(name, value);
            watchExpressions();
        }
    });

    $(document).off('keyup keypress input', '[data-textarea]').on('keyup keypress input', '[data-textarea]', function () {
        let name = $(this).data('state'),
            value = $(this).val();
        if (value.match(/^[0-9\.\,]+$/)) {
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
    $(document).off('change', '[data-checkbox]').on('change', '[data-checkbox]', function () {
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
    $(document).on('change', '[data-radio]', function () {
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
    $(document).off('change', '[data-file]').on('change', '[data-file]', function () {
        let name = $(this).data('state'),
            value = $(this)[0].files;
        if (!$(this).attr('multiple')) {
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
    $(document).off('change', '[data-select]').on('change', '[data-select]', function () {
        const name = $(this).data('state'),
            value = $(this).val();
        if (typeof value !== 'object' && stateCheckDepth(name) !== value) {
            setStateEvent(name, value, $state[name]);
            stateUpdateDepth(name, value);
            watchExpressions();
        }
    });

}

const watchExpressions = function () {

    $('[data-css]').each(function () {

        const styles = {};

        $.each($(this)[0].dataset, function (key, val) {
            if (key !== 'css' && key.includes('css')) {
                key = key.replace('css', '');
                key = key.charAt(0).toLowerCase() + key.slice(1);
                styles[key] = val.match(/[\.\}\$\+\']+/g) ? eval(val) : val;
            }
        });

        $(this).css(styles);
    });

    $('[data-disabled]').each(function () {
        const disabled = eval($(this).data('disabled'));
        if (disabled) {
            $(this).attr('disabled', 'disabled');
        } else {
            $(this).removeAttr('disabled');
        }
    });

    $('[data-class]').each(function () {
        const [condition, className] = eval($(this).data('class'));
        if (condition) {
            $(this).addClass(className);
        } else {
            $(this).removeClass(className);
        }
    });

    $('[data-text]').each(function () {
        if ($(this).html() !== stateCheckDepth($(this).data('text'))) {
            $(this).html(stateCheckDepth($(this).data('text')));
        }
    });

    $('[data-attribute]').each(function () {
        let [attribute, code] = eval($(this).data('attribute'));

        if (code) {
            code = code.replaceAll(/\$\{(.*?)\}/g, '###$1###');
            code = code.replaceAll(/\{(.*?)\}/gsu, function (expression, content) {
                content = content
                    .replaceAll('&amp;', '&')
                    .replaceAll('&gt;', '>')
                    .replaceAll('&lt;', '<')
                    .replaceAll(/###(.*?)###/g, '${$1}');
                return eval(content);
            }.bind(this));
            $(this).attr(attribute, code);
        }
    });

    $('[data-expression]').each(function () {
        const expression = eval($(this).data('expression'));
        $(this).html(expression);
    });

    $('[data-show]').each(function () {
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

const stateEffect = function (callback, states = false) {
    if (states) {
        $.each(states, (key, state) => {
            $(document).on(state, function (event, newValue, oldValue) {
                callback(newValue, oldValue, state);
            });
        });
    } else {
        callback();
    }
}

const updateBlocks = function () {
    $('[data-block]').each(function () {
        let html = $(this).html();

        html = html.replaceAll(/\$\{(.*?)\}/g, '###$1###');
        html = html.replaceAll(/\{(.*?)\}/gsu, function (expression, content) {
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

const setDomStates = function () {

    $('[data-states]').each(function () {
        const states = eval('JSON.parse(JSON.stringify(' + $(this).data('states') + '))');
        for (state in states) {
            $state[state] = states[state];
        }
    });

    $('[data-state]').each(function () {

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

        if ($(this).is('input:not(:checkbox):not(:radio):not(:file)')) {
            value = $(this).val() || null;
            if (value && value.match(/^[0-9\.\,]+$/)) {
                value = parseFloat(value);
            }
            $(this).attr('data-input', '');
            if (_state) {
                $(this).val(_state);
            }
        }

        if ($(this).is(':checkbox')) {
            value = $(this).prop('checked') || false;
            if (_state) {
                $(this).prop('checked', _state);
            }
            $(this).attr('data-checkbox', '');
        }

        if ($(this).is(':radio')) {
            if (!value) {
                value = $(this).filter(':checked').val() || false;
            }
            if (_state) {
                $(this).prop('checked', _state);
            }
            $(this).attr('data-radio', '');
        }

        if ($(this).prop('tagName') === 'TEXTAREA') {
            value = $(this).val() || null;
            if (value && value.match(/^[0-9\.\,]+$/)) {
                value = parseFloat(value);
            }
            $(this).attr('data-textarea', '');
            if (_state) {
                $(this).val(_state);
            }
        }

        if ($(this).is(':file:not([data-custom])')) {
            value = false;
            $(this).attr('data-file', '');
        }

        if ($(this).is('select')) {
            if ($(this).attr('multiple')) {
                value = $(this).val();
            } else {
                value = $('option:selected:not(:disabled)', this).val() || null;
            }
            if (_state) {
                if (typeof _state === 'object') {
                    $.each(_state, function (key, val) {
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

const setStateEvent = function (key, newValue, oldValue) {
    $(document).trigger(key, [newValue, oldValue]);
}

const getState = function (name) {
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

$(document).trigger('jq-data-api');
