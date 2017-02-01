from django.template import Template

RSVP = Template('''
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>Info</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <style type="text/css">
    </style>
</head>
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
