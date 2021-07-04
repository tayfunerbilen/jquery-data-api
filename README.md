# jquery-data-api

jQuery'i kullanırken diğer javascript frameworkleri gibi biraz daha reactive olsa dediğim çok zaman olmuştu zamanında. Artık çok fazla jquery kullanmasamda projelerinde hala kullananlar olabileceğini düşündüğüm için basit bir `data-api` sistemi geliştirdim.

Örneklere bakarak ne işe yaradıklarını daha iyi anlayabilirsiniz.

## Örnekler

### State tanımlama

Stateleri iki farklı şekilde tanımlayabilirsiniz. `data-state` niteliğiyle ya da `setState()` metoduyla. Örnek vermek gerekirse;

```html
<input type="text" data-state="name" value="Tayfun" />
```

ya da 

```js
setState('name', 'Tayfun');
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

### `[data-disabled]` niteliği

Duruma göre `disabled` niteliği eklemek için kullanabilirsiniz. Örneğin;

```html
<input type="text" data-state="name" placeholder="Adınızı yazın"> <br>
<button data-disabled="!$state.name">Gönder</button>
```