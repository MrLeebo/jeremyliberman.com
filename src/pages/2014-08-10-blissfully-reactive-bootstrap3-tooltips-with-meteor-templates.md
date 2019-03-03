---
title: "Blissfully Reactive Bootstrap3 Tooltips with Meteor Templates"
description: "I can teach you how to automatically update your tooltips when a label changes."
date: 2014-08-10
---

It’s been a long time since I wrote something here. I thought I would break the silence with a new post about [Meteor][meteor].

Meteor makes it pretty easy to start prototyping a new project very quickly.
When you want your ol’ familiar Bootstrap for CSS, you just `meteor add bootstrap` and there it is, including the stylish `$el.tooltip()` component.

So while building templates in Meteor, I thought I had tooltips figured out. I’d write them something like this:

```html
<!-- my_awesome_template.html -->
<template name="my_awesome_template">
  <a id="current" href="#" title="{{tooltip_label}}">My Awesome Post</a>
</template>
```

```coffeescript
# my_awesome_template.coffee
Template.my_awesome_template.rendered = ->
@\$('[title]').tooltip()

Template.my_awesome_template.tooltip_label = ->
"It has #{Likes.find().count()} like(s)!"
```

Which looked great, but I quickly came to realize that when my **Likes** Collection changed, the bootstrap tooltip wasn’t getting refreshed, even though the underlying title attribute was. I tried using several event binding techniques like `observe` to try and refresh the tooltip whenever the collection changed, but those strategies weren’t panning out. I wasn’t interested in squirreling away a lot of tooltip code into my subscription callbacks, either.

It turns out, I was way over-complicating this. You see, I already have a function that was executing every time the label changed, it was just a tiny bit too fast. I wanted to refresh the tooltip AFTER the tooltip_label function ran, so this is what I did:

```coffeescript
Template.my_awesome_template.tooltip_label = ->
setTimeout (->
\$('#link').tooltip('fixTitle')
), 0
"It has #{Likes.find().count()} like(s)!"
```

By calling setTimeout with a zero delay, I queued up the code to refresh the tooltip immediately after the function returns. A simple no cruft way to include reactive Bootstrap Tooltips in your Meteor Templates.

**Updated August 10, 2014:**
Turns out you can use the `Meteor.defer` function to do the same thing as setTimeout in an even cleaner way. Now my CoffeeScript looks like this:

```coffeescript
Template.my_awesome_template.tooltip_label = ->
Meteor.defer -> \$('#link').tooltip('fixTitle')
"It has #{Likes.find().count()} like(s)!"
```

[meteor]: https://www.meteor.com
