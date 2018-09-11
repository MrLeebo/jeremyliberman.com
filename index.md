---
layout: default
---

<div class="blog-index">  
  {% assign page = site.posts.first %}
  {% assign content = page.content %}

  <div class="PageNavigation">
    {% if page.previous.url %}
      ← 
      <a class="prev" href="{{page.previous.url}}">{{page.previous.title}}</a>
    {% endif %}
    {% if page.next.url %}
      <a class="next" href="{{page.next.url}}">{{page.next.title}}</a>
      →
    {% endif %}
  </div>

  <div>
      <h1>{{page.title}}</h1>
      <strong>Posted:</strong> {{page.date | date: "%B %-d, %Y"}}
  </div>

  {{ content }}

  <div class="PageNavigation">
    {% if page.previous.url %}
      ← 
      <a class="prev" href="{{page.previous.url}}">{{page.previous.title}}</a>
    {% endif %}
    {% if page.next.url %}
      <a class="next" href="{{page.next.url}}">{{page.next.title}}</a>
      →
    {% endif %}
  </div>
</div>
