---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

{% include pagination.md %}

<div>
    <h1>{{page.title}}</h1>
    <strong>Posted:</strong> {{page.date | date: "%B %-d, %Y"}}
</div>

{{content}}
{% include pagination.md %}
