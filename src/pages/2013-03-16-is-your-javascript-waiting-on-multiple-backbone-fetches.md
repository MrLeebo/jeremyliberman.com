---
title: "Is your Javascript waiting on multiple Backbone fetches?"
date: 2013-03-16
---

I’ve been working with [Backbone](http://backbonejs.org) for approximately a month now. I’m a fan of using a structured coding practice to untangle your objects and the DOM.

In Backbone, you get the latest state of your model by fetching it from the server. You can set a callback on the fetch function directly or by binding to the collection’s reset event.

#### Tracking fetched collections manually

I needed to fetching more than one collection at the same time and call a callback when all of the fetches were finished. My first attempt wasn’t very good. I’ll give you a largely trivialized sample of what I had going on.

This is an example of a view written in [CoffeeScript](http://coffeescript.org). I want to fetch 3 different collections, render them using Handlebar templates, and call a function when all 3 collections are rendered:

```coffee
initialize: =>
  @apples = new MyModels.Apples
  @oranges = new MyModels.Oranges
  @bananas = new MyModels.Bananas
  @bindTo(@apples, 'reset', @renderApples)
  @bindTo(@oranges, 'reset', @renderOranges)
  @bindTo(@bananas, 'reset', @renderBananas)

render: =>
  @apples.fetch()
  @oranges.fetch()
  @bananas.fetch()
```

This actually isn’t bad so far. We create our models and bind an event so that when they are fetched, their respective render functions will be called. The real mess came later in the same file.

```coffee
renderBananas: =>
  @$el.html(HandlebarsTemplates["bananas"](
    bananas:@bananas.toJSON()))
  Backbone.ModelBinding.bind(this)

  @bananasLoaded = true
  @finishLoading()

finishLoading: =>
  return unless @applesLoaded
  return unless @orangesLoaded
  return unless @bananasLoaded

  alert("All collections loaded!")
```

For brevity, I left off renderApples and renderOranges. Those functions are identical to renderBananas with their respective fruits substituted in. This solution isn’t very scalable, as we need to create more state variables to track any new collections that get added in the future and make sure we account for those variables when we finish loading.

It would be better if we could define a callback that would wait for all of my fetch calls to finish. It would be even cooler if these things chained together.

#### Making promises

What I needed to be using are jQuery [Deferred Objects](http://api.jquery.com/category/deferred-object/). See, Backbone server calls (like fetch and save) are just \$.ajax() calls under the hood, and since jQuery 1.5, `$.ajax()` calls implement an immutable version of Deferred Object called a **Promise**. As it happens, everything in that code sample is already defer-able.
I’ll modify the view to make use of Promises.

```coffee
initialize: =>
  @apples = new MyModels.Apples
  @oranges = new MyModels.Oranges
  @bananas = new MyModels.Bananas
  # Dropped the bind calls, we won't be needing them!

fetchCollections: =>
  # Combines these individual promises into one.
  $.when(
    @apples.fetch(),
    @oranges.fetch(),
    @bananas.fetch()
  ).promise()

renderCollections: =>
  $.when(
    @renderApples(),
    @renderOranges(),
    @renderBananas()
  ).promise()

renderBananas: =>
  d = @$el.html(HandlebarsTemplates["bananas"](
    bananas:@bananas.toJSON()))
  Backbone.ModelBinding.bind(this)
  d.promise()

finishLoading: =>
  alert("All collections loaded!")
```

With all of this in place, the render function shown below is remarkably straightforward, and communicates the behavior of the view beautifully!

```coffee
render: =>
  @fetchCollections()
    .then(@renderCollections)
    .then(@finishLoading)
```

This function is so much better than before; it tells me everything that’s going to happen in a clean and concise way.

An additional enhancement I’ve snuck in was to return _promises_ for my `.html()` calls in the `renderBananas` function. Now I know that my HTML templates will be rendered before `finishLoading` gets called. This will protect me from making a mistake like attempting to `focus()` an element that maybe hasn’t been rendered yet.
