# jquery-data-api

jQuery'i kullanırken diğer javascript frameworkleri gibi biraz daha reactive olsa dediğim çok zaman olmuştu zamanında. Artık çok fazla jquery kullanmasamda projelerinde hala kullananlar olabileceğini düşündüğüm için basit bir `data-api` sistemi geliştirdim.

## Kullanabileceğiniz Metodlar

- [setState()](#setstate-metodu)
- [getState()](#getstate-metodu)
- [updateState()](#updatestate-metodu)
- [stateEffect()](#stateeffect-metodu)

## Kullanabileceğiniz Nitelikler

- [[data-state]](#data-state-niteliği)
- [[data-block]](#data-block-niteliği)
- [[data-disabled]](#data-disabled-niteliği)
- [[data-class]](#data-class-niteliği)
- [[data-show]](#data-show-niteliği)

Örneklere bakarak ne işe yaradıklarını daha iyi anlayabilirsiniz.

---

## Tüm Metodlar

### `setState()` metodu

State tanımlamak için bu metodu ya da [[data-state]](#data-state-niteliği) niteliğini kullanabilirsiniz.

```js
setState('name', 'Tayfun');
setState('todos', [
    {
        text: 'todo 1',
        done: false
    },
    {
        text: 'todo 2',
        done: true
    }
])
```

### `getState()` metodu

State değerini almak için bu metodu kullanabilirsiniz. Örneğin;

```html
<input type="text" data-state="name" placeholder="Bir şeyler yazın..">
<button onclick="getName()">Adı getir</button>

<script>
function getName() {
    alert(getState('name')); // inputa girilen değer
    // ya da $state değişkenini kullanabilirsiniz
    alert($state.name); // inputa girilen değer
}
</script>
```

### `updateState()` metodu

Mevcut state'i güncellemek için kullanabilirsiniz. Örneğin;

```html
<input type="text" data-state="name" />
<button onclick="updateState('name', 'Tayfun')">Güncelle</button>
```

### `stateEffect()` metodu

Tanımladığınız statelerde bir değişiklik olduğunda yakalamak için kullanabilirsiniz. Örneğin;

```html
<input type="text" data-state="name" placeholdre="Konsolda görmek için yazmaya başlayın" /> <br>
<input type="text" data-state="surname" placeholdre="Erbilen" />

<script>
    stateEffect((newValue, oldValue, state) => {
        // newValue = yeni değer
        // oldValue = eski değer
        // state    = hangi state olduğu
        console.log('State değişti', newValue, state);
    }, ['name', 'surname'])
</script>
```

---

## Tüm Nitelikler

### `[data-state]` niteliği

Değişebilir değerlerinizi tanımlamak için bu niteliği kullanabilirsiniz. Örneğin;

```html
<input type="text" data-state="name" value="Tayfun" />
```

Bütün stateler `$state` global değişkenin altında tutuluyor. Yani oluşturduğunuz state'e `$state.key` şeklinde ya da `state('key')` şeklinde erişebilirsiniz.

```js
console.log($state.name); // Tayfun
console.log(state('name')); // Tayfun
```

### `[data-block]` niteliği

Bu nitelik içinde `{$state.key}` şeklinde artık stateleriniz dinamik olarak gösterebilir ya da javascript ifadeleri yazabilirsiniz. Örneğin;

```html
<div data-block>
    <input type="text" data-state="name" value="Tayfun" /> <br>
    Değer = {$state.name}
</div>
```
ya da bir javascript ifadesine örnek vermek gerekirse

```html
<div data-block>
    <input type="checkbox" data-state="accept" value="1" /> <br>
    ${$state.accept ? 'Kuralları kabul ettin' : 'Lütfen kuralları kabul et'}
</div>
```

bir başka örnek

```html
<input type="number" data-state="num1" value="2" /> <br>
<input type="number" data-state="num2" value="3" />

<div data-block>
    {$state.num1 * $state.num2}
</div>
```

### `[data-disabled]` niteliği

Duruma göre `disabled` niteliği eklemek için kullanabilirsiniz. Örneğin;

```html
<input type="text" data-state="name" placeholder="Adınızı yazın"> <br>
<button data-disabled="!$state.name">Gönder</button>
```

### `[data-class]` niteliği

Duruma göre `class` ekletmek için kullanabilirsiniz. Örneğin;

```html
<style>
.accepted {
    background: lime;
}
</style>

<label data-block data-class="[$state.accept, 'accepted']">
    <input type="checkbox" value="1" data-state="accept" />
    {$state.accept ? 'Kabul ettiğiniz için teşekkürler' : 'Kuralları kabul et'}
</label>
```

### `[data-show]` niteliği

Duruma göre gizleyip/göstermek istediğiniz alanlar için kullanabilirsiniz. Örneğin;

```html
<label>
    <input type="checkbox" data-state="accept_rules" value="1">
    Kuralları kabul edin
</label>

<div data-show="$state.accept_rules" style="padding: 10px; background: lime">
    burayı kuralları kabul ettiğinizde göreceksiniz!
</div>
```