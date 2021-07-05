# jquery-data-api

jQuery'i kullanırken diğer javascript frameworkleri gibi biraz daha reactive olsa dediğim çok zaman olmuştu zamanında. Artık çok fazla jquery kullanmasamda projelerinde hala kullananlar olabileceğini düşündüğüm için basit bir `data-api` sistemi geliştirdim.

## Kullanabileceğiniz Metodlar

- [setState()](#setstate-metodu)
- [getState()](#getstate-metodu)
- [updateState()](#updatestate-metodu)
- [stateEffect()](#stateeffect-metodu)

## Kullanabileceğiniz Nitelikler

- [[data-state]](#data-state-niteliği)
- [[data-value]](#data-value-niteliği)
- [[data-block]](#data-block-niteliği)
- [[data-disabled]](#data-disabled-niteliği)
- [[data-class]](#data-class-niteliği)
- [[data-show]](#data-show-niteliği)
- [[data-expression]](#data-expression-niteliği)
- [[data-for]](#data-for-niteliği)
- [[data-css]](#data-css-niteliği)

## Örnek Kullanımlar

Örneklere bakarak bu scriptin ne yaptığını daha iyi anlayabilirsiniz.

- [Tab Örneği](https://github.com/tayfunerbilen/jquery-data-api/tree/main/ornekler/tab-ornegi)
- [Form Örneği](https://github.com/tayfunerbilen/jquery-data-api/tree/main/ornekler/form-ornegi)
- [Todolist Örneği](https://github.com/tayfunerbilen/jquery-data-api/tree/main/ornekler/todo-ornegi)
- [CSS Örneği](https://github.com/tayfunerbilen/jquery-data-api/tree/main/ornekler/css-ornegi)
- [Para Harcama Örneği](https://github.com/tayfunerbilen/jquery-data-api/tree/main/ornekler/para-harcama-ornegi)

---

> **Not:** Bu script'in hataları olabilir. Javascript frameworkleri gibi çalışmaz, belli kurallar dahilinde kodlarınıza biraz reactivite katmak için kullanabilirsiniz. SPA oluşturmak için yeterli değildir, örneklerde basit bir SPA oluşturduk ancak bu scriptin amacına çokta uygun bir örnek değil bunu aklınızdan çıkarmayın :)

## Olaylar

### `jq-data-api` Olayı

Script kullanıma uygun hale geldiğinde bu olayı trigger eder. Hata almamak için state tanımlamalarınızı metodlarla yapıyorsanız ve stateEffect() metodunu kullanıyorsanız bunun içinde yazmaya özen gösterin.

```js
$(document).on('jq-data-api', function() {
    // tanımlar
    setState('name', 'Tayfun');
    
    stateEffect((name) => {
        console.log('state değişti', name);
    }, ['name'])
});
```

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

Bütün stateler `$state` global değişkenin altında tutuluyor. Yani oluşturduğunuz state'e `$state.key` şeklinde ya da `getState('key')` şeklinde erişebilirsiniz.

```js
console.log($state.name); // Tayfun
console.log(getState('name')); // Tayfun
```

### `[data-value]` niteliği

`[data-state]` ile oluşturduğunuz state'e değer atamak için kullanabilirsiniz. Ancak javascript ifadesi gibi çalışacağı için eğer string bir değer atayacaksanız tırnaklar içinde kullanmanız gerekiyor. Ayrıca dizi vs.de tanımlayabilirsiniz. Örneğin;

```html
<select multiple data-state="skills" data-value="['php', 'js']">
    <option value="php">PHP</option>
    <option value="js">Javascript</option>
    <option value="python">Python</option>
    <option value="css">CSS</option>
</select>

<input type="text" data-state="name" data-value="'Tayfun'">

<!-- Alternatif olarak form elemanlarına value ile değer verebilir ya da checked, selected gibi nitelikleri ekleyerekte state'in değerini oluşturmasını sağlayabilirsiniz -->
<input type="text" data-state="name2" value="Tayfun2">
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

### `[data-expression]` niteliği

Javascript ifadeleri çalıştırmak için kullanabilirsiniz. Genellikle `[data-for]` içinde kullanırsanız işinize çok yarayacaktır. State güncellendiğinde otomatik olarak bu ifadede güncellenecektir. Örneğin;

```html
<input type="text" data-state="name" value="Tayfun">
<button onclick="updateState('name', 'Murat')">İsmi Değiştir</button>

<div data-expression="$state.name === 'Murat' ? 'Yanlış isim' : 'Doğru yoldasın!'"></div>
```

### `[data-for]` niteliği

For döngüsünden bir farkı yok. Kullanırken `[data-for]` içinde state'i belirtiyoruz ve ilgili elemanı içeride hangi isimle kullanacağımızıda `[data-as]` ile belirliyoruz. Örneğin;

```html
<style>
li.done {
    background-color: lime;
}
</style>

<ul data-for="todos" data-as="todo">
    <template>
        <li class="{todo.done ? 'done' : ''}">
            {todo.name}
        </li>
    </template>
</ul>

<script>
const todos = [
    {
        name: 'todo 1',
        done: false
    },
    {
        name: 'todo 2',
        done: true
    }
];
setState('todos', todos);
</script>
```

### `[data-css]` niteliği

Değişen değerlerinizi css olarak tanımlamak isterseniz bu niteliği kullanabilirsiniz. Daha sonra değişmesini istediğiniz değeri `data-css` ten hemen sonra belirtin. Mesela `background-color` değeri için `[data-css-background-color=""]` şeklinde tanımlama yapmalısınız. Örneğin;

```html
<style>
.box {
    width: 100px;
    height: 100px;
}
</style>

<div class="box" data-css data-css-color="$state.color === 'yellow' ? 'black' : 'white'" data-css-background-color="$state.color || 'blue'">box</div>

<select data-state="color">
    <option selected disabled>Renk seçin</option>
    <option value="yellow">Sarı</option>
    <option value="red">Kırmızı</option>
    <option value="black">Siyah</option>
</select>
```