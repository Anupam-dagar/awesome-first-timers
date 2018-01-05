<div class="users">
  {% for profile in site.data.profiles.profiles %}
  <div class="card">
    <h1>{{ profile.Name }}</h1>
    <p class="title"> {{ profile.Bio | markdownify }}</p>
    <p class="location">{{ profile.Place | markdownify }}</p>
    <div>
      {% if profile.GitHub %}
      <a href="{{profile.GitHub}}"><i class="fa fa-lg fa-github"></i></a> 
      {% endif %}

      {% if profile.Facebook %}
      <a href="{{profile.Facebook}}"><i class="fa fa-lg fa-facebook"></i></a> 
      {% endif %}
    </div>
  </div>
  {% endfor %}
</div>
