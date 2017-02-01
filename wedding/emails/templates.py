from django.template import Template

RSVP = Template('''
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head></head>
<body>
<ul>
{% for person_form in form %}
<li>
<ul>
 {% for key, value in person_form.form.items %}
 <li>{{ key }} : {{ value }}</li>
 {% endfor %}
</ul>
</li>
{% endfor %}
</ul>
</body>
</html>
''')